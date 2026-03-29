// ============================================
// AI FEATURES API
// Resume bullet generation, summary generation, job parsing
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { 
  generateBullets, 
  generateSummary, 
  parseJobDescription,
  generateInterviewQuestions,
  getCachedResult,
  setCachedResult
} from '@/lib/ai-engine';

// Rate limiting (simple in-memory, would use Redis in production)
const rateLimits = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60000; // 1 minute

function checkRateLimit(userId: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const limit = rateLimits.get(userId);

  if (!limit || now > limit.resetTime) {
    rateLimits.set(userId, { count: 1, resetTime: now + RATE_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  if (limit.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  limit.count++;
  return { allowed: true, remaining: RATE_LIMIT - limit.count };
}

// ============================================
// POST /api/ai
// Various AI feature endpoints
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    // Rate limiting (use user ID from auth in production)
    const userId = data?.userId || 'anonymous';
    const rateCheck = checkRateLimit(userId);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { 
          status: 429,
          headers: { 'X-RateLimit-Remaining': '0' }
        }
      );
    }

    switch (action) {
      case 'generateBullets': {
        const { jobTitle, companyName, industry, seniority, technologies, focusArea } = data;

        if (!jobTitle || !companyName) {
          return NextResponse.json(
            { error: 'Missing required fields: jobTitle, companyName' },
            { status: 400 }
          );
        }

        // Check cache
        const cacheKey = `bullets:${jobTitle}:${companyName}:${industry || 'general'}`;
        const cached = getCachedResult<{ bullets: string[] }>(cacheKey);
        if (cached) {
          return NextResponse.json({
            success: true,
            data: cached,
            cached: true,
          });
        }

        const result = await generateBullets(
          jobTitle,
          companyName,
          industry || 'Technology',
          seniority || 'Mid-Level',
          technologies || [],
          focusArea || 'General development'
        );

        if (!result.success) {
          return NextResponse.json(
            { error: result.error },
            { status: 500 }
          );
        }

        // Cache the result
        setCachedResult(cacheKey, result.data);

        return NextResponse.json({
          success: true,
          data: result.data,
          rateLimitRemaining: rateCheck.remaining,
        });
      }

      case 'generateSummary': {
        const { jobTitle, yearsExperience, currentRole, skills, achievements, industry, primaryFocus } = data;

        if (!jobTitle || !currentRole) {
          return NextResponse.json(
            { error: 'Missing required fields: jobTitle, currentRole' },
            { status: 400 }
          );
        }

        // Check cache
        const cacheKey = `summary:${jobTitle}:${yearsExperience}:${currentRole}`;
        const cached = getCachedResult<{ summary: string }>(cacheKey);
        if (cached) {
          return NextResponse.json({
            success: true,
            data: cached,
            cached: true,
          });
        }

        const result = await generateSummary(
          jobTitle,
          yearsExperience || 5,
          currentRole,
          skills || [],
          achievements || [],
          industry || 'Technology',
          primaryFocus || jobTitle
        );

        if (!result.success) {
          return NextResponse.json(
            { error: result.error },
            { status: 500 }
          );
        }

        setCachedResult(cacheKey, result.data);

        return NextResponse.json({
          success: true,
          data: result.data,
          rateLimitRemaining: rateCheck.remaining,
        });
      }

      case 'parseJobDescription': {
        const { jobDescription } = data;

        if (!jobDescription) {
          return NextResponse.json(
            { error: 'Missing jobDescription' },
            { status: 400 }
          );
        }

        // Check cache
        const cacheKey = `job:${Buffer.from(jobDescription.slice(0, 100)).toString('base64')}`;
        const cached = getCachedResult<unknown>(cacheKey);
        if (cached) {
          return NextResponse.json({
            success: true,
            data: cached,
            cached: true,
          });
        }

        const result = await parseJobDescription(jobDescription);

        if (!result.success) {
          return NextResponse.json(
            { error: result.error },
            { status: 500 }
          );
        }

        setCachedResult(cacheKey, result.data);

        return NextResponse.json({
          success: true,
          data: result.data,
          rateLimitRemaining: rateCheck.remaining,
        });
      }

      case 'generateInterviewQuestions': {
        const { jobTitle, yearsExperience, currentRole, skills, industry, focusAreas } = data;

        if (!jobTitle || !currentRole) {
          return NextResponse.json(
            { error: 'Missing required fields: jobTitle, currentRole' },
            { status: 400 }
          );
        }

        // Check cache
        const cacheKey = `interview:${jobTitle}:${yearsExperience}`;
        const cached = getCachedResult<unknown>(cacheKey);
        if (cached) {
          return NextResponse.json({
            success: true,
            data: cached,
            cached: true,
          });
        }

        const result = await generateInterviewQuestions(
          jobTitle,
          yearsExperience || 5,
          currentRole,
          skills || [],
          industry || 'Technology',
          focusAreas || ['technical skills', 'problem solving', 'teamwork']
        );

        if (!result.success) {
          return NextResponse.json(
            { error: result.error },
            { status: 500 }
          );
        }

        setCachedResult(cacheKey, result.data);

        return NextResponse.json({
          success: true,
          data: result.data,
          rateLimitRemaining: rateCheck.remaining,
        });
      }

      case 'rewriteBullets': {
        const { bullets, jobTitle, improvement } = data;

        if (!bullets || !Array.isArray(bullets) || bullets.length === 0) {
          return NextResponse.json(
            { error: 'Missing or invalid bullets array' },
            { status: 400 }
          );
        }

        // Simple rewriting prompt
        const improvedBullets = bullets.map((bullet: string, index: number) => {
          // In production, this would call AI to improve each bullet
          // For now, return with improvement notes
          return {
            original: bullet,
            improved: bullet, // Would be AI-improved
            suggestions: [
              'Consider adding a metric or percentage',
              'Use a stronger action verb',
              'Show impact on business outcomes',
            ],
          };
        });

        return NextResponse.json({
          success: true,
          data: {
            bullets: improvedBullets,
            jobTitle,
            improvement: improvement || 'general',
          },
        });
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('AI Features API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// GET /api/ai
// Get AI feature capabilities and limits
// ============================================

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    data: {
      features: [
        {
          id: 'bulletGeneration',
          name: 'Bullet Generation',
          description: 'Generate professional, impact-driven resume bullets using AI',
          endpoint: '/api/ai (action: generateBullets)',
          requiresSubscription: 'PRO',
        },
        {
          id: 'summaryGeneration',
          name: 'Summary Generation',
          description: 'Create compelling professional summaries',
          endpoint: '/api/ai (action: generateSummary)',
          requiresSubscription: 'PRO',
        },
        {
          id: 'jobParsing',
          name: 'Job Description Parser',
          description: 'Extract skills, keywords, and requirements from job postings',
          endpoint: '/api/ai (action: parseJobDescription)',
          requiresSubscription: 'PRO',
        },
        {
          id: 'interviewCoach',
          name: 'Interview Coach',
          description: 'Generate practice interview questions with feedback',
          endpoint: '/api/ai (action: generateInterviewQuestions)',
          requiresSubscription: 'PREMIUM',
        },
        {
          id: 'bulletRewriter',
          name: 'Bullet Rewriter',
          description: 'Improve existing resume bullets with AI suggestions',
          endpoint: '/api/ai (action: rewriteBullets)',
          requiresSubscription: 'PRO',
        },
      ],
      limits: {
        free: { requestsPerMinute: 2, requestsPerDay: 10 },
        pro: { requestsPerMinute: 10, requestsPerDay: 100 },
        premium: { requestsPerMinute: 30, requestsPerDay: 500 },
      },
      model: 'gpt-4o-mini',
      version: '1.0.0',
    },
  });
}