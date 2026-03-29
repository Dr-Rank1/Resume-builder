// ============================================
// AI ENGINE - ENTERPRISE GRADE AI SYSTEM
// Implements AI features for the resume platform
// ============================================

import OpenAI from 'openai';

// ============================================
// AI CLIENT CONFIGURATION
// ============================================

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ============================================
// PROMPT TEMPLATES
// ============================================

interface PromptTemplate {
  system: string;
  user: string;
  temperature?: number;
  maxTokens?: number;
}

// Bullet generation prompt
const BULLET_GENERATION_PROMPT: PromptTemplate = {
  system: `You are an expert resume writer with 20+ years of experience crafting impactful bullet points for technology professionals. Your bullets:
- Start with strong action verbs (Developed, Architected, Led, Optimized, Implemented)
- Include quantifiable metrics when possible (%, $, time saved)
- Demonstrate impact, not just tasks
- Are concise (1-2 lines max)
- Use the STAR method implicitly (Action -> Result)

Output valid JSON with an array of 5-7 bullet points. Each bullet should be a string.`,
  user: `Generate professional resume bullets for a {{jobTitle}} at {{companyName}}.

Role details:
- Industry: {{industry}}
- Seniority: {{seniority}}
- Key technologies: {{technologies}}
- Role focus: {{focusArea}}

Generate bullets that:
1. Show quantifiable impact
2. Use industry-relevant keywords
3. Demonstrate progression/leadership
4. Highlight technical depth

Example format:
["Led team of 5 engineers to deliver cloud migration saving $50K annually", ...]

Generate exactly 5 bullet points.`,
  temperature: 0.7,
  maxTokens: 800,
};

// Resume summary prompt
const SUMMARY_GENERATION_PROMPT: PromptTemplate = {
  system: `You are an expert resume writer crafting compelling professional summaries.
- Keep it to 3-4 sentences
- Lead with years of experience and key specialization
- Include 2-3 relevant technologies or skills
- End with what the candidate brings to employers
- Use active voice and confident language
- Do NOT use first person pronouns (no "I" statements)

Output valid JSON with a "summary" field containing the summary text.`,
  user: `Write a professional summary for a {{jobTitle}} with {{yearsExperience}} years of experience.

Background:
- Current role: {{currentRole}}
- Top skills: {{skills}}
- Key achievements: {{achievements}}
- Industry focus: {{industry}}

The summary should:
- Highlight expertise in {{primaryFocus}}
- Show career progression
- Include measurable impact if available
- Sound confident and professional

Output format: {"summary": "Your 3-4 sentence summary here..."}`,
  temperature: 0.6,
  maxTokens: 400,
};

// Job description parser prompt
const JOB_PARSER_PROMPT: PromptTemplate = {
  system: `You are an expert job description analyzer. Parse job postings to extract structured information.

Output valid JSON with these fields:
- title: The job title
- company: Company name (if inferable)
- requiredSkills: Array of must-have skills/technologies
- preferredSkills: Array of nice-to-have skills
- keywords: Important keywords for ATS matching
- responsibilities: Array of 3-5 key responsibilities
- qualifications: Array of required qualifications
- seniority: Estimated seniority level (entry/mid/senior/lead/executive)
- salary: Salary range if mentioned (or null)`,
  user: `Parse this job description:

{{jobDescription}}

Return ONLY valid JSON with the structure specified.`,
  temperature: 0.1,
  maxTokens: 1200,
};

// ATS matching prompt
const ATS_MATCHING_PROMPT: PromptTemplate = {
  system: `You are an ATS (Applicant Tracking System) expert analyzing resumes against job descriptions.

Output valid JSON with:
- matchScore: Number 0-100 representing overall match percentage
- keywordMatch: Object with matched and missing keywords
- sectionScores: Scores for each resume section (summary, experience, education, skills)
- suggestions: Array of specific improvements to increase match rate
- strengths: Array of strong points in the resume
- weaknesses: Array of weak points or gaps
- overallFeedback: Brief 2-3 sentence assessment

Be strict but fair. A good resume for a mid-level position should score 70-85.`,
  user: `Compare this resume against the job description and provide detailed ATS analysis.

RESUME:
{{resume}}

JOB DESCRIPTION:
{{jobDescription}}

Provide detailed matching analysis.`,
  temperature: 0.3,
  maxTokens: 1500,
};

// Interview question generation prompt
const INTERVIEW_COACH_PROMPT: PromptTemplate = {
  system: `You are an expert interview coach helping candidates prepare for job interviews.

Output valid JSON with:
- behavioral: Array of 5 behavioral questions (use STAR format)
- technical: Array of 3-5 technical questions based on role
- situational: Array of 3 scenario-based questions
- tips: Array of preparation tips for this role

Questions should be specific to the role and realistic for actual interviews.`,
  user: `Generate interview preparation questions for a {{jobTitle}} position.

Candidate background:
- Experience: {{yearsExperience}} years
- Current role: {{currentRole}}
- Skills: {{skills}}
- Target industry: {{industry}}

Focus questions on:
- {{focusAreas}}

Generate realistic, challenging questions that would be asked in a real interview.`,
  temperature: 0.7,
  maxTokens: 2000,
};

// ============================================
// PROMPT ENGINE - Variable Substitution
// ============================================

export function buildPrompt(template: PromptTemplate, variables: Record<string, string>): { system: string; user: string } {
  const interpolate = (text: string) =>
    text.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] || `[${key}]`);

  return {
    system: interpolate(template.system),
    user: interpolate(template.user),
  };
}

// ============================================
// AI RESPONSE TYPES
// ============================================

export interface BulletGenerationResult {
  bullets: string[];
  tokensUsed: number;
  cost: number;
}

export interface SummaryGenerationResult {
  summary: string;
  tokensUsed: number;
  cost: number;
}

export interface JobParsingResult {
  title: string;
  company: string | null;
  requiredSkills: string[];
  preferredSkills: string[];
  keywords: string[];
  responsibilities: string[];
  qualifications: string[];
  seniority: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  salary: { min: number; max: number } | null;
  tokensUsed: number;
  cost: number;
}

export interface ATSMatchingResult {
  matchScore: number;
  keywordMatch: {
    matched: string[];
    missing: string[];
  };
  sectionScores: {
    summary: number;
    experience: number;
    education: number;
    skills: number;
  };
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
  overallFeedback: string;
  tokensUsed: number;
  cost: number;
}

export interface InterviewCoachResult {
  behavioral: string[];
  technical: string[];
  situational: string[];
  tips: string[];
  tokensUsed: number;
  cost: number;
}

// ============================================
// TOKEN & COST ESTIMATION
// ============================================

const TOKEN_PRICING = {
  'gpt-4o': { input: 0.000005, output: 0.000015 }, // $5/1M input, $15/1M output
  'gpt-4o-mini': { input: 0.00000015, output: 0.0000006 }, // $0.15/1M input, $0.60/1M output
  'gpt-3.5-turbo': { input: 0.0000005, output: 0.0000015 }, // $0.50/1M input, $1.50/1M output
};

export function estimateCost(tokens: number, model: string = 'gpt-4o-mini', isOutput: boolean = false): number {
  const pricing = TOKEN_PRICING[model as keyof typeof TOKEN_PRICING] || TOKEN_PRICING['gpt-4o-mini'];
  return tokens * (isOutput ? pricing.output : pricing.input);
}

// ============================================
// AI API FUNCTIONS
// ============================================

interface AIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  cached?: boolean;
}

// Generic AI completion with retry logic
async function aiCompletion<T>(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  temperature: number = 0.7,
  maxTokens: number = 1000,
  retries: number = 3
): Promise<AIResponse<T>> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        temperature,
        max_tokens: maxTokens,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return { success: false, error: 'No response content' };
      }

      const data = JSON.parse(content) as T;
      return { success: true, data };
    } catch (error) {
      if (attempt === retries - 1) {
        console.error('AI API Error:', error);
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'AI API error occurred' 
        };
      }
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  return { success: false, error: 'Max retries exceeded' };
}

// ============================================
// AI ENGINE FUNCTIONS
// ============================================

// Generate resume bullets
export async function generateBullets(
  jobTitle: string,
  companyName: string,
  industry: string,
  seniority: string,
  technologies: string[],
  focusArea: string
): Promise<AIResponse<BulletGenerationResult>> {
  const prompt = buildPrompt(BULLET_GENERATION_PROMPT, {
    jobTitle,
    companyName,
    industry,
    seniority,
    technologies: technologies.join(', '),
    focusArea,
  });

  const result = await aiCompletion<{ bullets: string[] }>(
    [
      { role: 'system', content: prompt.system },
      { role: 'user', content: prompt.user },
    ],
    BULLET_GENERATION_PROMPT.temperature || 0.7,
    BULLET_GENERATION_PROMPT.maxTokens || 800
  );

  if (!result.success || !result.data) {
    return result as AIResponse<BulletGenerationResult>;
  }

  return {
    success: true,
    data: {
      bullets: result.data.bullets,
      tokensUsed: 0, // Would need to track from OpenAI response
      cost: 0, // Would calculate from tokens
    },
  };
}

// Generate professional summary
export async function generateSummary(
  jobTitle: string,
  yearsExperience: number,
  currentRole: string,
  skills: string[],
  achievements: string[],
  industry: string,
  primaryFocus: string
): Promise<AIResponse<SummaryGenerationResult>> {
  const prompt = buildPrompt(SUMMARY_GENERATION_PROMPT, {
    jobTitle,
    yearsExperience: yearsExperience.toString(),
    currentRole,
    skills: skills.join(', '),
    achievements: achievements.join('; '),
    industry,
    primaryFocus,
  });

  const result = await aiCompletion<{ summary: string }>(
    [
      { role: 'system', content: prompt.system },
      { role: 'user', content: prompt.user },
    ],
    SUMMARY_GENERATION_PROMPT.temperature || 0.6,
    SUMMARY_GENERATION_PROMPT.maxTokens || 400
  );

  if (!result.success || !result.data) {
    return result as AIResponse<SummaryGenerationResult>;
  }

  return {
    success: true,
    data: {
      summary: result.data.summary,
      tokensUsed: 0,
      cost: 0,
    },
  };
}

// Parse job description
export async function parseJobDescription(
  jobDescription: string
): Promise<AIResponse<JobParsingResult>> {
  const prompt = buildPrompt(JOB_PARSER_PROMPT, {
    jobDescription,
  });

  const result = await aiCompletion<JobParsingResult>(
    [
      { role: 'system', content: prompt.system },
      { role: 'user', content: prompt.user },
    ],
    JOB_PARSER_PROMPT.temperature || 0.1,
    JOB_PARSER_PROMPT.maxTokens || 1200
  );

  return result;
}

// ATS matching analysis
export async function analyzeATSMatch(
  resumeText: string,
  jobDescription: string
): Promise<AIResponse<ATSMatchingResult>> {
  const prompt = buildPrompt(ATS_MATCHING_PROMPT, {
    resume: resumeText,
    jobDescription,
  });

  const result = await aiCompletion<ATSMatchingResult>(
    [
      { role: 'system', content: prompt.system },
      { role: 'user', content: prompt.user },
    ],
    ATS_MATCHING_PROMPT.temperature || 0.3,
    ATS_MATCHING_PROMPT.maxTokens || 1500
  );

  return result;
}

// Generate interview questions
export async function generateInterviewQuestions(
  jobTitle: string,
  yearsExperience: number,
  currentRole: string,
  skills: string[],
  industry: string,
  focusAreas: string[]
): Promise<AIResponse<InterviewCoachResult>> {
  const prompt = buildPrompt(INTERVIEW_COACH_PROMPT, {
    jobTitle,
    yearsExperience: yearsExperience.toString(),
    currentRole,
    skills: skills.join(', '),
    industry,
    focusAreas: focusAreas.join(', '),
  });

  const result = await aiCompletion<InterviewCoachResult>(
    [
      { role: 'system', content: prompt.system },
      { role: 'user', content: prompt.user },
    ],
    INTERVIEW_COACH_PROMPT.temperature || 0.7,
    INTERVIEW_COACH_PROMPT.maxTokens || 2000
  );

  return result;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Keyword extraction from text
export function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need',
    'this', 'that', 'these', 'those', 'i', 'we', 'they', 'you', 'it',
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));

  const frequency: Record<string, number> = {};
  words.forEach(w => {
    frequency[w] = (frequency[w] || 0) + 1;
  });

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word);
}

// Calculate keyword match percentage
export function calculateKeywordMatch(
  resumeKeywords: string[],
  jobKeywords: string[]
): { matched: string[]; missing: string[]; score: number } {
  const resumeSet = new Set(resumeKeywords.map(k => k.toLowerCase()));
  const jobSet = new Set(jobKeywords.map(k => k.toLowerCase()));

  const matched: string[] = [];
  const missing: string[] = [];

  jobSet.forEach(keyword => {
    if (resumeSet.has(keyword)) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  });

  const score = jobSet.size > 0 ? Math.round((matched.length / jobSet.size) * 100) : 0;

  return { matched, missing, score };
}

// ============================================
// CACHE MANAGEMENT (In-memory for now, Redis in production)
// ============================================

const aiCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 15; // 15 minutes

export function getCachedResult<T>(key: string): T | null {
  const cached = aiCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }
  return null;
}

export function setCachedResult<T>(key: string, data: T): void {
  aiCache.set(key, { data, timestamp: Date.now() });
}

// ============================================
// EXPORTS
// ============================================

export const AIEngine = {
  generateBullets,
  generateSummary,
  parseJobDescription,
  analyzeATSMatch,
  generateInterviewQuestions,
  extractKeywords,
  calculateKeywordMatch,
  getCachedResult,
  setCachedResult,
};

export default AIEngine;