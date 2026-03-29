// ============================================
// ATS MATCHING API
// Compare resumes against job descriptions
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { analyzeATSMatch, extractKeywords } from '@/lib/ai-engine';

// POST /api/ats/match
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeText, jobDescription } = body;

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: 'Missing resumeText or jobDescription' },
        { status: 400 }
      );
    }

    // Get AI-powered analysis
    const result = await analyzeATSMatch(resumeText, jobDescription);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'AI analysis failed' },
        { status: 500 }
      );
    }

    // Also do keyword-based matching for comparison
    const resumeKeywords = extractKeywords(resumeText);
    const jobKeywords = extractKeywords(jobDescription);

    const matchingKeywords = resumeKeywords.filter(k => 
      jobKeywords.some(jk => jk.includes(k) || k.includes(jk))
    );

    const missingKeywords = jobKeywords.filter(k =>
      !resumeKeywords.some(rk => rk.includes(k) || k.includes(rk))
    ).slice(0, 10); // Top 10 missing

    // Combine AI analysis with keyword matching
    const combinedResult = {
      ...result.data,
      keywordMatch: {
        matched: [...new Set([...result.data.keywordMatch.matched, ...matchingKeywords])],
        missing: result.data.keywordMatch.missing.length > 0 
          ? result.data.keywordMatch.missing 
          : missingKeywords,
      },
      overallScore: result.data.matchScore,
      matchBreakdown: {
        keywordMatch: Math.round((matchingKeywords.length / Math.max(jobKeywords.length, 1)) * 40),
        sectionScore: Math.round(
          (result.data.sectionScores.summary + 
           result.data.sectionScores.experience + 
           result.data.sectionScores.education + 
           result.data.sectionScores.skills) / 4
        ),
        recommendations: result.data.suggestions,
      },
    };

    return NextResponse.json(combinedResult, { status: 200 });

  } catch (error) {
    console.error('ATS Match API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/ats/match - Quick keyword check
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resumeText = searchParams.get('resume');
    const jobDescription = searchParams.get('job');

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: 'Missing resume or job parameters' },
        { status: 400 }
      );
    }

    // Simple keyword matching without AI
    const resumeKeywords = extractKeywords(resumeText);
    const jobKeywords = extractKeywords(jobDescription);

    const matched = resumeKeywords.filter(k =>
      jobKeywords.some(jk => jk.includes(k) || k.includes(jk))
    );

    const missing = jobKeywords.filter(k =>
      !resumeKeywords.some(rk => rk.includes(k) || k.includes(rk))
    );

    const score = Math.round((matched.length / Math.max(jobKeywords.length, 1)) * 100);

    return NextResponse.json({
      matchScore: score,
      keywordMatch: {
        matched,
        missing: missing.slice(0, 15),
      },
      totalResumeKeywords: resumeKeywords.length,
      totalJobKeywords: jobKeywords.length,
      isQuickCheck: true,
    }, { status: 200 });

  } catch (error) {
    console.error('ATS Quick Check Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}