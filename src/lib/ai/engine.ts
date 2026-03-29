// ============================================
// AI ENGINE - CORE MODULE
// Enterprise-grade AI processing with caching, rate limiting, and retry logic
// ============================================

import OpenAI from 'openai';
import { PrismaClient, AIFeatureType } from '@prisma/client';
import { 
  PromptTemplates, 
  buildPrompt, 
  parseJSONResponse, 
  SystemPrompts,
  PromptVariables 
} from './prompts';

// Initialize clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const prisma = new PrismaClient();

// ============================================
// TYPES & INTERFACES
// ============================================

export interface AIResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  tokens?: number;
  cached?: boolean;
  cost?: number;
}

export interface ATSMatchResult {
  matchScore: number;
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  keywordsScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  missingKeywords: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  atsOptimizations: string[];
}

export interface JobParseResult {
  skills: string[];
  softSkills: string[];
  keywords: string[];
  responsibilities: string[];
  requirements: string[];
  experienceLevel: string;
  employmentType: string;
  location: string;
}

export interface BulletGenerationResult {
  bullets: string[];
  score: number;
  keywords: string[];
}

export interface InterviewQuestion {
  type: 'BEHAVIORAL' | 'TECHNICAL';
  question: string;
  context?: string;
  idealApproach?: string;
}

// ============================================
// CACHE MANAGEMENT
// ============================================

interface CacheConfig {
  ttlSeconds: number;
  maxSize: number;
}

const DEFAULT_CACHE_TTL = 3600; // 1 hour

async function getCachedResponse(
  cacheKey: string
): Promise<string | null> {
  try {
    const cached = await prisma.aICachedResponse.findUnique({
      where: { cacheKey },
    });
    
    if (cached && cached.expiresAt > new Date()) {
      return cached.output;
    }
    
    return null;
  } catch (error) {
    console.error('Cache retrieval error:', error);
    return null;
  }
}

async function cacheResponse(
  cacheKey: string,
  input: string,
  output: string,
  model: string,
  ttlSeconds: number = DEFAULT_CACHE_TTL
): Promise<void> {
  try {
    await prisma.aICachedResponse.upsert({
      where: { cacheKey },
      update: {
        output,
        expiresAt: new Date(Date.now() + ttlSeconds * 1000),
      },
      create: {
        cacheKey,
        input,
        output,
        model,
        expiresAt: new Date(Date.now() + ttlSeconds * 1000),
      },
    });
  } catch (error) {
    console.error('Cache write error:', error);
  }
}

function generateCacheKey(
  featureType: AIFeatureType,
  variables: PromptVariables
): string {
  const hashInput = `${featureType}:${JSON.stringify(variables)}`;
  // Simple hash for cache key
  let hash = 0;
  for (let i = 0; i < hashInput.length; i++) {
    const char = hashInput.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `${featureType}:${Math.abs(hash).toString(16)}`;
}

// ============================================
// TOKEN & COST TRACKING
// ============================================

const MODEL_COSTS: Record<string, { prompt: number; completion: number }> = {
  'gpt-4-turbo-preview': { prompt: 10, completion: 30 }, // $0.01/$0.03 per 1K tokens
  'gpt-4': { prompt: 30, completion: 60 },
  'gpt-3.5-turbo': { prompt: 0.5, completion: 1.5 },
};

function calculateCost(
  promptTokens: number,
  completionTokens: number,
  model: string
): number {
  const costs = MODEL_COSTS[model] || MODEL_COSTS['gpt-4-turbo-preview'];
  return (promptTokens * costs.prompt + completionTokens * costs.completion) / 1000;
}

async function trackAIUsage(
  userId: string,
  featureType: AIFeatureType,
  input: string,
  output: string,
  promptTokens: number,
  completionTokens: number,
  model: string,
  cacheHit: boolean = false,
  organizationId?: string
): Promise<void> {
  try {
    const totalTokens = promptTokens + completionTokens;
    const cost = calculateCost(promptTokens, completionTokens, model);
    
    await prisma.$transaction([
      // Create usage record
      prisma.aIUsage.create({
        data: {
          userId,
          organizationId,
          featureType,
          input,
          output,
          promptTokens,
          completionTokens,
          totalTokens,
          model,
          cost,
          cacheHit,
        },
      }),
      // Update user's AI credits used
      prisma.user.update({
        where: { id: userId },
        data: {
          aiCreditsUsed: { increment: totalTokens },
        },
      }),
    ]);
  } catch (error) {
    console.error('AI usage tracking error:', error);
  }
}

// ============================================
// RATE LIMITING
// ============================================

interface RateLimitConfig {
  maxRequests: number;
  windowSeconds: number;
}

const RATE_LIMITS: Record<AIFeatureType, RateLimitConfig> = {
  BULLET_GENERATOR: { maxRequests: 30, windowSeconds: 60 },
  RESUME_REWRITER: { maxRequests: 20, windowSeconds: 60 },
  JOB_PARSER: { maxRequests: 50, windowSeconds: 60 },
  ATS_MATCHING: { maxRequests: 10, windowSeconds: 60 },
  INTERVIEW_COACH: { maxRequests: 15, windowSeconds: 60 },
  SKILL_SUGGESTOR: { maxRequests: 30, windowSeconds: 60 },
  SUMMARY_GENERATOR: { maxRequests: 25, windowSeconds: 60 },
};

async function checkRateLimit(
  userId: string,
  featureType: AIFeatureType
): Promise<boolean> {
  const limit = RATE_LIMITS[featureType];
  const windowStart = new Date(Date.now() - limit.windowSeconds * 1000);
  
  try {
    const recentUsage = await prisma.aIUsage.count({
      where: {
        userId,
        featureType,
        createdAt: { gte: windowStart },
      },
    });
    
    return recentUsage < limit.maxRequests;
  } catch (error) {
    console.error('Rate limit check error:', error);
    return true; // Allow on error to not block users
  }
}

// ============================================
// INPUT SANITIZATION (Prompt Injection Prevention)
// ============================================

function sanitizeInput(input: string): string {
  if (!input) return '';
  
  return input
    .slice(0, 10000) // Limit input length
    .replace(/\[(SYSTEM|USER|ASSISTANT)\]/gi, '') // Remove role indicators
    .replace(/<\|.*?\|>/g, '') // Remove potential injection tokens
    .replace(/```/g, '') // Remove code blocks
    .trim();
}

// ============================================
// CORE AI CALL WITH RETRY LOGIC
// ============================================

interface AICallOptions {
  model?: string;
  temperature?: number;
  maxRetries?: number;
  cacheEnabled?: boolean;
  cacheTTL?: number;
}

const DEFAULT_OPTIONS: AICallOptions = {
  model: 'gpt-4-turbo-preview',
  temperature: 0.7,
  maxRetries: 3,
  cacheEnabled: true,
  cacheTTL: DEFAULT_CACHE_TTL,
};

async function callAI<T>(
  systemPrompt: string,
  userPrompt: string,
  userId: string,
  featureType: AIFeatureType,
  organizationId?: string,
  options: AICallOptions = {}
): Promise<AIResult<T>> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Rate limit check
  const allowed = await checkRateLimit(userId, featureType);
  if (!allowed) {
    return {
      success: false,
      error: 'Rate limit exceeded. Please wait before making more requests.',
    };
  }
  
  // Sanitize inputs
  const sanitizedUserPrompt = sanitizeInput(userPrompt);
  
  // Check cache
  if (opts.cacheEnabled) {
    const cacheKey = generateCacheKey(featureType, { prompt: sanitizedUserPrompt });
    const cached = await getCachedResponse(cacheKey);
    
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        return { success: true, data: parsed, cached: true };
      } catch {
        // Invalid cache, continue
      }
    }
  }
  
  // Retry logic
  let lastError: string = '';
  
  for (let attempt = 0; attempt < (opts.maxRetries || 1); attempt++) {
    try {
      const startTime = Date.now();
      
      const response = await openai.chat.completions.create({
        model: opts.model || 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: sanitizedUserPrompt },
        ],
        temperature: opts.temperature,
        response_format: { type: 'json_object' },
      });
      
      const content = response.choices[0]?.message?.content;
      const usage = response.usage;
      
      if (!content) {
        throw new Error('Empty response from AI');
      }
      
      // Track usage
      if (usage) {
        await trackAIUsage(
          userId,
          featureType,
          sanitizedUserPrompt,
          content,
          usage.prompt_tokens,
          usage.completion_tokens,
          opts.model || 'gpt-4-turbo-preview',
          false,
          organizationId
        );
      }
      
      // Parse and validate response
      const validation = await parseJSONResponse<T>(content);
      
      if (validation.success && validation.data) {
        // Cache successful response
        if (opts.cacheEnabled) {
          const cacheKey = generateCacheKey(featureType, { prompt: sanitizedUserPrompt });
          await cacheResponse(cacheKey, sanitizedUserPrompt, content, opts.model || 'gpt-4-turbo-preview', opts.cacheTTL);
        }
        
        return {
          success: true,
          data: validation.data,
          tokens: usage?.total_tokens,
          cost: usage ? calculateCost(usage.prompt_tokens, usage.completion_tokens, opts.model || 'gpt-4-turbo-preview') : 0,
        };
      }
      
      lastError = validation.error || 'Invalid response format';
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Unknown error';
      
      // Exponential backoff
      if (attempt < (opts.maxRetries || 1) - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }
  
  return {
    success: false,
    error: `Failed after ${opts.maxRetries} attempts: ${lastError}`,
  };
}

// ============================================
// PROMPT CHAINING
// ============================================

interface ChainStep {
  systemPrompt: string;
  userPrompt: string;
  extractKey?: string;
}

async function executePromptChain<T>(
  steps: ChainStep[],
  userId: string,
  organizationId?: string
): Promise<AIResult<T>> {
  let context: Record<string, any> = {};
  
  for (const step of steps) {
    // Build user prompt with context from previous steps
    let userPrompt = step.userPrompt;
    for (const [key, value] of Object.entries(context)) {
      userPrompt = userPrompt.replace(new RegExp(`{${key}}`, 'g'), String(value));
    }
    
    const result = await callAI<Record<string, any>>(
      step.systemPrompt,
      userPrompt,
      userId,
      AIFeatureType.JOB_PARSER, // Primary feature type
      organizationId
    );
    
    if (!result.success || !result.data) {
      return { success: false, error: result.error };
    }
    
    // Extract specified key if provided
    if (step.extractKey && result.data[step.extractKey]) {
      context[step.extractKey] = result.data[step.extractKey];
    }
    
    // Merge all data into context
    context = { ...context, ...result.data };
  }
  
  return { success: true, data: context as T };
}

// ============================================
// AI FEATURE IMPLEMENTATIONS
// ============================================

/**
 * Generate resume bullet points
 */
export async function generateBulletPoints(
  userId: string,
  variables: {
    jobTitle: string;
    company: string;
    jobDescription: string;
    responsibilities: string[];
    industry?: string;
    experienceLevel?: string;
  },
  organizationId?: string
): Promise<AIResult<BulletGenerationResult>> {
  const prompt = buildPrompt(PromptTemplates.BULLET_GENERATOR, {
    jobTitle: variables.jobTitle,
    company: variables.company,
    jobDescription: variables.jobDescription,
    responsibilities: variables.responsibilities,
    industry: variables.industry || 'Technology',
    experienceLevel: variables.experienceLevel || 'MID',
  });
  
  const result = await callAI<{ bullets: string[]; score?: number; keywords?: string[] }>(
    SystemPrompts.RESUME_WRITER,
    prompt,
    userId,
    AIFeatureType.BULLET_GENERATOR,
    organizationId
  );
  
  if (result.success && result.data) {
    return {
      success: true,
      data: {
        bullets: result.data.bullets || [],
        score: result.data.score || 75,
        keywords: result.data.keywords || [],
      },
    };
  }
  
  return { success: false, error: result.error };
}

/**
 * Rewrite resume section with senior-level phrasing
 */
export async function rewriteResumeSection(
  userId: string,
  variables: {
    originalText: string;
    jobTitle: string;
    targetLevel: string;
    industry: string;
    skills: string[];
  },
  organizationId?: string
): Promise<AIResult<{ improved: string; changes: string[] }>> {
  const prompt = buildPrompt(PromptTemplates.RESUME_REWRITER, {
    originalText: variables.originalText,
    jobTitle: variables.jobTitle,
    targetLevel: variables.targetLevel,
    industry: variables.industry,
    skills: variables.skills,
  });
  
  return callAI<{ improved: string; changes: string[] }>(
    SystemPrompts.RESUME_WRITER,
    prompt,
    userId,
    AIFeatureType.RESUME_REWRITER,
    organizationId
  );
}

/**
 * Parse job description to extract structured data
 */
export async function parseJobDescription(
  userId: string,
  jobDescription: string,
  organizationId?: string
): Promise<AIResult<JobParseResult>> {
  const prompt = buildPrompt(PromptTemplates.JOB_PARSER, {
    jobDescription,
  });
  
  return callAI<JobParseResult>(
    SystemPrompts.ATS_EXPERT,
    prompt,
    userId,
    AIFeatureType.JOB_PARSER,
    organizationId,
    { cacheTTL: 86400 } // Cache job parsing for 24 hours
  );
}

/**
 * Calculate ATS match score between resume and job
 */
export async function calculateATSMatch(
  userId: string,
  variables: {
    resumeId: string;
    jobDescription: string;
    resumeContent: string;
  },
  organizationId?: string
): Promise<AIResult<ATSMatchResult>> {
  const prompt = buildPrompt(PromptTemplates.ATS_MATCHER, {
    jobDescription: variables.jobDescription,
    resumeContent: variables.resumeContent,
  });
  
  const result = await callAI<ATSMatchResult>(
    SystemPrompts.ATS_EXPERT,
    prompt,
    userId,
    AIFeatureType.ATS_MATCHING,
    organizationId
  );
  
  // Store match result in database
  if (result.success && result.data) {
    try {
      // Find the job posting by description similarity or create match record
      // This would be enhanced with proper job ID passing
      await prisma.candidateMatch.upsert({
        where: {
          id: `${variables.resumeId}-${Date.now()}`,
        },
        update: {},
        create: {
          id: `${variables.resumeId}-${Date.now()}`,
          resumeId: variables.resumeId,
          jobId: 'pending', // Would be passed properly
          matchScore: result.data.matchScore,
          matchGrade: result.data.matchScore >= 80 ? 'EXCELLENT' 
            : result.data.matchScore >= 60 ? 'GOOD' 
            : result.data.matchScore >= 40 ? 'FAIR' : 'POOR',
          skillsScore: result.data.skillsScore,
          experienceScore: result.data.experienceScore,
          educationScore: result.data.educationScore,
          keywordsScore: result.data.keywordsScore,
          matchedSkills: result.data.matchedSkills,
          missingSkills: result.data.missingSkills,
          missingKeywords: result.data.missingKeywords,
          strengths: result.data.strengths,
          weaknesses: result.data.weaknesses,
          suggestions: result.data.suggestions,
        },
      });
    } catch (error) {
      console.error('Failed to store match result:', error);
    }
  }
  
  return result;
}

/**
 * Generate interview questions
 */
export async function generateInterviewQuestions(
  userId: string,
  variables: {
    jobTitle: string;
    industry: string;
    experienceLevel: string;
    responsibilities: string[];
    interviewType: 'BEHAVIORAL' | 'TECHNICAL' | 'MIXED';
    count?: number;
  },
  organizationId?: string
): Promise<AIResult<{ questions: InterviewQuestion[]; tips: string[]; commonPitfalls: string[] }>> {
  const prompt = buildPrompt(PromptTemplates.INTERVIEW_QUESTIONS, {
    ...variables,
    count: variables.count || 5,
  });
  
  return callAI<{ questions: InterviewQuestion[]; tips: string[]; commonPitfalls: string[] }>(
    SystemPrompts.INTERVIEW_COACH,
    prompt,
    userId,
    AIFeatureType.INTERVIEW_COACH,
    organizationId
  );
}

/**
 * Provide interview answer feedback
 */
export async function getInterviewFeedback(
  userId: string,
  variables: {
    question: string;
    answer: string;
    jobTitle: string;
    keySkills: string[];
  },
  organizationId?: string
): Promise<AIResult<{
  score: number;
  strengths: string[];
  improvements: string[];
  feedback: string;
  criteriaScores: Record<string, number>;
  suggestedAnswer: string;
  tips: string[];
}>> {
  const prompt = buildPrompt(PromptTemplates.INTERVIEW_FEEDBACK, variables);
  
  return callAI(prompt, userId, AIFeatureType.INTERVIEW_COACH, organizationId);
}

/**
 * Suggest skills based on job context
 */
export async function suggestSkills(
  userId: string,
  variables: {
    jobTitle: string;
    industry: string;
    experienceLevel: string;
    currentSkills: string[];
    targetRoles: string[];
  },
  organizationId?: string
): Promise<AIResult<{
  technicalSkills: string[];
  softSkills: string[];
  emergingSkills: string[];
  certifications: string[];
  reasoning: string;
}>> {
  const prompt = buildPrompt(PromptTemplates.SKILL_SUGGESTOR, variables);
  
  return callAI(
    SystemPrompts.CAREER_ADVISOR,
    prompt,
    userId,
    AIFeatureType.SKILL_SUGGESTOR,
    organizationId
  );
}

/**
 * Generate professional summary
 */
export async function generateSummary(
  userId: string,
  variables: {
    name: string;
    jobTitle: string;
    yearsExperience: number;
    skills: string[];
    industry: string;
    careerGoals: string;
    achievements: string[];
  },
  organizationId?: string
): Promise<AIResult<string>> {
  const prompt = buildPrompt(PromptTemplates.SUMMARY_GENERATOR, variables);
  
  const result = await callAI<{ summary?: string }>(
    SystemPrompts.RESUME_WRITER,
    prompt,
    userId,
    AIFeatureType.SUMMARY_GENERATOR,
    organizationId
  );
  
  if (result.success && result.data) {
    return {
      success: true,
      data: (result.data as any).summary || '',
    };
  }
  
  return { success: false, error: result.error };
}

// ============================================
// CREDIT CHECK UTILITY
// ============================================

export async function checkUserCredits(userId: string): Promise<{
  hasCredits: boolean;
  remaining: number;
  tier: string;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { 
      aiCredits: true, 
      aiCreditsUsed: true,
      aiCreditsPurchased: true,
      subscriptionTier: true 
    },
  });
  
  if (!user) {
    return { hasCredits: false, remaining: 0, tier: 'FREE' };
  }
  
  const availableCredits = user.aiCredits + user.aiCreditsPurchased - user.aiCreditsUsed;
  
  return {
    hasCredits: availableCredits > 0,
    remaining: Math.max(0, availableCredits),
    tier: user.subscriptionTier,
  };
}

// ============================================
// BATCH PROCESSING FOR RECRUITERS
// ============================================

export async function batchCalculateMatches(
  recruiterId: string,
  jobId: string,
  resumeIds: string[]
): Promise<ATSMatchResult[]> {
  const job = await prisma.jobPosting.findUnique({
    where: { id: jobId },
    select: { description: true, requirements: true },
  });
  
  if (!job) {
    throw new Error('Job not found');
  }
  
  const results: ATSMatchResult[] = [];
  
  for (const resumeId of resumeIds) {
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
      include: {
        sections: true,
      },
    });
    
    if (!resume) continue;
    
    // Combine all sections into resume content
    const resumeContent = resume.sections
      .map(s => `${s.title || s.type}: ${JSON.stringify(s.content)}`)
      .join('\n\n');
    
    const result = await calculateATSMatch(recruiterId, {
      resumeId,
      jobDescription: `${job.description}\n\n${job.requirements}`,
      resumeContent,
    });
    
    if (result.success && result.data) {
      results.push(result.data);
    }
  }
  
  return results;
}