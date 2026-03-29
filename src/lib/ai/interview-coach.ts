// ============================================
// AI INTERVIEW COACH - PREMIUM FEATURE
// Simulate interviews, generate questions, provide feedback
// ============================================

import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { checkFeatureAccess, consumeAICredit } from '@/lib/billing/stripe';
import { generateInterviewQuestions, getInterviewFeedback } from '@/lib/ai/engine';

const prisma = new PrismaClient();

// ============================================
// TYPES
// ============================================

export interface InterviewConfig {
  jobTitle?: string;
  industry?: string;
  experienceLevel?: string;
  interviewType: 'BEHAVIORAL' | 'TECHNICAL' | 'MIXED';
  questionCount: number;
  jobPostingId?: string;
}

export interface InterviewQuestion {
  id: string;
  type: 'BEHAVIORAL' | 'TECHNICAL';
  question: string;
  context?: string;
  idealApproach?: string;
}

export interface InterviewAnswer {
  questionId: string;
  answer: string;
}

export interface InterviewFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  feedback: string;
  criteriaScores: {
    clarity: number;
    specificity: number;
    relevance: number;
    starMethod?: number;
    technicalAccuracy?: number;
  };
  suggestedAnswer: string;
  tips: string[];
}

// ============================================
// INTERVIEW SESSION MANAGEMENT
// ============================================

/**
 * Create a new interview session
 */
export async function createInterviewSession(
  config: InterviewConfig
): Promise<{ sessionId: string; questions: InterviewQuestion[] }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  // Check if user has access to Interview Coach
  const hasAccess = await checkFeatureAccess(session.user.id, 'interviewCoach');
  if (!hasAccess) {
    throw new Error('Interview Coach is a Premium feature. Please upgrade your plan.');
  }

  // Generate questions using AI
  const result = await generateInterviewQuestions(
    session.user.id,
    {
      jobTitle: config.jobTitle || 'General Position',
      industry: config.industry || 'Technology',
      experienceLevel: config.experienceLevel || 'MID',
      responsibilities: [], // Could be extracted from job posting
      interviewType: config.interviewType,
      count: config.questionCount,
    }
  );

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to generate questions');
  }

  // Create session in database
  const interviewSession = await prisma.interviewSession.create({
    data: {
      userId: session.user.id,
      jobTitle: config.jobTitle,
      jobPostingId: config.jobPostingId,
      interviewType: config.interviewType,
      duration: config.questionCount * 5, // 5 minutes per question
      questionCount: config.questionCount,
      startedAt: new Date(),
    },
  });

  // Create questions in database
  const questions: InterviewQuestion[] = [];
  
  for (let i = 0; i < result.data.questions.length; i++) {
    const q = result.data.questions[i];
    const dbQuestion = await prisma.interviewQuestion.create({
      data: {
        sessionId: interviewSession.id,
        questionNum: i + 1,
        type: q.type,
        question: q.question,
        context: q.context,
        idealAnswer: q.idealApproach,
      },
    });

    questions.push({
      id: dbQuestion.id,
      type: dbQuestion.type as 'BEHAVIORAL' | 'TECHNICAL',
      question: dbQuestion.question,
      context: dbQuestion.context || undefined,
      idealApproach: dbQuestion.idealAnswer || undefined,
    });
  }

  return {
    sessionId: interviewSession.id,
    questions,
  };
}

/**
 * Get interview session with current state
 */
export async function getInterviewSession(sessionId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const interviewSession = await prisma.interviewSession.findUnique({
    where: { id: sessionId },
    include: {
      questions: {
        orderBy: { questionNum: 'asc' },
      },
      jobPosting: {
        select: { id: true, title: true, requirements: true },
      },
    },
  });

  if (!interviewSession) {
    throw new Error('Interview session not found');
  }

  // Check ownership
  if (interviewSession.userId !== session.user.id) {
    throw new Error('Access denied');
  }

  return {
    id: interviewSession.id,
    jobTitle: interviewSession.jobTitle,
    interviewType: interviewSession.interviewType,
    duration: interviewSession.duration,
    questionCount: interviewSession.questionCount,
    currentQuestion: interviewSession.currentQuestion,
    isCompleted: interviewSession.isCompleted,
    startedAt: interviewSession.startedAt,
    completedAt: interviewSession.completedAt,
    overallScore: interviewSession.overallScore,
    strengths: interviewSession.strengths,
    improvements: interviewSession.improvements,
    questions: interviewSession.questions.map(q => ({
      id: q.id,
      num: q.questionNum,
      type: q.type,
      question: q.question,
      context: q.context,
      answered: !!q.answer,
      score: q.score,
    })),
    job: interviewSession.jobPosting,
  };
}

/**
 * Submit an answer and get AI feedback
 */
export async function submitAnswer(
  sessionId: string,
  questionId: string,
  answer: string
): Promise<InterviewFeedback> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  // Consume AI credit
  const hasCredit = await consumeAICredit(session.user.id);
  if (!hasCredit) {
    throw new Error('Insufficient AI credits. Please upgrade or purchase more credits.');
  }

  // Get the question
  const question = await prisma.interviewQuestion.findUnique({
    where: { id: questionId },
    include: {
      session: true,
    },
  });

  if (!question || question.sessionId !== sessionId) {
    throw new Error('Question not found');
  }

  // Update question with answer
  await prisma.interviewQuestion.update({
    where: { id: questionId },
    data: {
      answer,
      answerTokens: answer.split(' ').length,
    },
  });

  // Get AI feedback
  const feedback = await getInterviewFeedback(
    session.user.id,
    {
      question: question.question,
      answer,
      jobTitle: question.session.jobTitle || 'General Position',
      keySkills: [], // Could be extracted from user's resume
    }
  );

  if (!feedback.success || !feedback.data) {
    // Still save the answer, just no feedback
    return {
      score: 0,
      strengths: [],
      improvements: [],
      feedback: 'Feedback generation failed. Your answer has been saved.',
      criteriaScores: { clarity: 0, specificity: 0, relevance: 0 },
      suggestedAnswer: '',
      tips: [],
    };
  }

  // Update question with feedback
  await prisma.interviewQuestion.update({
    where: { id: questionId },
    data: {
      score: feedback.data.score,
      feedback: feedback.data.detailedFeedback,
      criteria: feedback.data.criteriaScores,
    },
  });

  // Create feedback record
  await prisma.interviewFeedback.create({
    data: {
      userId: session.user.id,
      sessionId,
      questionId,
      feedback: feedback.data.detailedFeedback,
      score: feedback.data.score,
      criteria: feedback.data.criteriaScores,
      suggestions: feedback.data.tips,
      model: 'gpt-4-turbo-preview',
      tokensUsed: 0, // Would track from AI response
    },
  });

  return {
    score: feedback.data.score,
    strengths: feedback.data.strengths,
    improvements: feedback.data.improvements,
    feedback: feedback.data.detailedFeedback,
    criteriaScores: feedback.data.criteriaScores,
    suggestedAnswer: feedback.data.suggestedAnswer,
    tips: feedback.data.tips,
  };
}

/**
 * Move to next question
 */
export async function nextQuestion(sessionId: string): Promise<{
  isComplete: boolean;
  nextQuestion?: {
    id: string;
    num: number;
    type: string;
    question: string;
    context?: string;
  };
}> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const interviewSession = await prisma.interviewSession.findUnique({
    where: { id: sessionId },
    include: {
      questions: {
        orderBy: { questionNum: 'asc' },
      },
    },
  });

  if (!interviewSession) {
    throw new Error('Interview session not found');
  }

  const nextIndex = interviewSession.currentQuestion + 1;
  
  if (nextIndex >= interviewSession.questions.length) {
    // Interview is complete
    await completeInterview(sessionId);
    return { isComplete: true };
  }

  // Update current question index
  await prisma.interviewSession.update({
    where: { id: sessionId },
    data: { currentQuestion: nextIndex },
  });

  const nextQ = interviewSession.questions[nextIndex];
  
  return {
    isComplete: false,
    nextQuestion: {
      id: nextQ.id,
      num: nextIndex + 1,
      type: nextQ.type,
      question: nextQ.question,
      context: nextQ.context || undefined,
    },
  };
}

/**
 * Complete interview and calculate overall score
 */
export async function completeInterview(sessionId: string): Promise<{
  overallScore: number;
  strengths: string[];
  improvements: string[];
}> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  // Get all questions with scores
  const questions = await prisma.interviewQuestion.findMany({
    where: { sessionId },
  });

  const answeredQuestions = questions.filter(q => q.score !== null);
  
  if (answeredQuestions.length === 0) {
    throw new Error('No answered questions to calculate score');
  }

  // Calculate overall score
  const totalScore = answeredQuestions.reduce((sum, q) => sum + (q.score || 0), 0);
  const overallScore = Math.round(totalScore / answeredQuestions.length);

  // Aggregate strengths and improvements from all feedback
  const allFeedbacks = await prisma.interviewFeedback.findMany({
    where: { sessionId },
  });

  const strengthCounts = new Map<string, number>();
  const improvementCounts = new Map<string, number>();

  for (const fb of allFeedbacks) {
    // This would need to parse the feedback text for actual strengths
    // For now, we aggregate by feedback count
    if (fb.feedback) {
      strengthCounts.set('Good answer structure', (strengthCounts.get('Good answer structure') || 0) + 1);
    }
    if (fb.suggestions) {
      const suggestions = fb.suggestions as string[];
      for (const s of suggestions) {
        improvementCounts.set(s, (improvementCounts.get(s) || 0) + 1);
      }
    }
  }

  // Get top 3 strengths and improvements
  const strengths = Array.from(strengthCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([s]) => s);

  const improvements = Array.from(improvementCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([i]) => i);

  // Update session
  await prisma.interviewSession.update({
    where: { id: sessionId },
    data: {
      isCompleted: true,
      completedAt: new Date(),
      overallScore,
      strengths,
      improvements,
    },
  });

  return {
    overallScore,
    strengths: strengths.length > 0 ? strengths : ['Clear communication'],
    improvements: improvements.length > 0 ? improvements : ['Add more specific examples'],
  };
}

/**
 * Get user's interview history
 */
export async function getInterviewHistory(page = 1, limit = 10) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const [sessions, total] = await Promise.all([
    prisma.interviewSession.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        jobTitle: true,
        interviewType: true,
        questionCount: true,
        isCompleted: true,
        overallScore: true,
        startedAt: true,
        completedAt: true,
        _count: {
          select: { questions: true },
        },
      },
    }),
    prisma.interviewSession.count({
      where: { userId: session.user.id },
    }),
  ]);

  return {
    sessions: sessions.map(s => ({
      id: s.id,
      jobTitle: s.jobTitle,
      interviewType: s.interviewType,
      totalQuestions: s._count.questions,
      completedQuestions: s.isCompleted ? s.questionCount : null,
      score: s.overallScore,
      startedAt: s.startedAt,
      completedAt: s.completedAt,
    })),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get specific question with feedback (for review)
 */
export async function getQuestionFeedback(questionId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const question = await prisma.interviewQuestion.findUnique({
    where: { id: questionId },
    include: {
      session: true,
      feedbacks: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  if (!question || question.session.userId !== session.user.id) {
    throw new Error('Question not found');
  }

  return {
    question: {
      id: question.id,
      num: question.questionNum,
      type: question.type,
      question: question.question,
      context: question.context,
    },
    answer: question.answer,
    feedback: question.feedback,
    score: question.score,
    criteria: question.criteria,
    idealAnswer: question.idealAnswer,
    aiFeedback: question.feedbacks[0] || null,
  };
}

// ============================================
// INTERVIEW TIPS BY TYPE
// ============================================

export const INTERVIEW_TIPS = {
  BEHAVIORAL: [
    'Use the STAR method: Situation, Task, Action, Result',
    'Be specific with numbers and metrics when possible',
    'Focus on your contributions, not just team accomplishments',
    'Show self-awareness in your responses',
    'Connect your experience to the role requirements',
  ],
  TECHNICAL: [
    'Explain your thought process before jumping to code',
    'Ask clarifying questions when needed',
    'Discuss trade-offs and alternatives',
    'Think out loud - interviewers want to see your reasoning',
    'Don\'t panic if you don\'t know the answer immediately',
  ],
  MIXED: [
    'Prepare for both behavioral and technical questions',
    'Practice coding AND soft skills',
    'Review the job description for clues',
    'Prepare thoughtful questions for the interviewer',
    'Research the company culture beforehand',
  ],
};

export function getTipsForType(type: 'BEHAVIORAL' | 'TECHNICAL' | 'MIXED'): string[] {
  return INTERVIEW_TIPS[type] || INTERVIEW_TIPS.MIXED;
}