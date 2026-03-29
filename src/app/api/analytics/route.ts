// ============================================
// ANALYTICS DASHBOARD - API ROUTES
// Enterprise-grade analytics for users and admins
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// ============================================
// TYPES
// ============================================

interface TimeSeriesData {
  date: string;
  value: number;
}

interface DashboardMetrics {
  totalResumes: number;
  totalViews: number;
  averageAtsScore: number;
  aiCreditsUsed: number;
  aiCreditsRemaining: number;
}

interface AnalyticsResponse {
  metrics: DashboardMetrics;
  timeSeries: {
    resumes: TimeSeriesData[];
    views: TimeSeriesData[];
    atsScores: TimeSeriesData[];
  };
  topJobs: any[];
  recentActivity: any[];
}

// ============================================
// USER ANALYTICS
// ============================================

/**
 * GET /api/analytics/user - Get user's personal analytics
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d'; // 7d, 30d, 90d, 1y
    const dashboard = searchParams.get('dashboard') || 'user'; // user, admin, recruiter

    switch (dashboard) {
      case 'user':
        return NextResponse.json(await getUserAnalytics(session.user.id, period));
      case 'admin':
        return NextResponse.json(await getAdminAnalytics(period));
      case 'recruiter':
        return NextResponse.json(await getRecruiterAnalytics(session.user.id, period));
      default:
        return NextResponse.json({ error: 'Invalid dashboard type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

// ============================================
// USER ANALYTICS IMPLEMENTATION
// ============================================

async function getUserAnalytics(
  userId: string,
  period: string
): Promise<AnalyticsResponse> {
  const startDate = getStartDate(period);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      aiCredits: true,
      aiCreditsUsed: true,
      aiCreditsPurchased: true,
      subscriptionTier: true,
    },
  });

  // Get user's resumes
  const resumes = await prisma.resume.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      atsScore: true,
      views: undefined, // Need to check if this field exists
      createdAt: true,
    },
  });

  // Calculate time series data for resumes
  const resumeTimeSeries = await getResumeTimeSeries(userId, startDate);
  
  // Calculate ATS scores over time (if available)
  const atsTimeSeries = await getATSScoreTimeSeries(userId, startDate);

  // Get AI usage stats
  const aiUsage = await prisma.aIUsage.groupBy({
    by: ['featureType'],
    where: {
      userId,
      createdAt: { gte: startDate },
    },
    _count: true,
    _sum: {
      totalTokens: true,
    },
  });

  // Get recent AI usage
  const recentAIUsage = await prisma.aIUsage.findMany({
    where: {
      userId,
      createdAt: { gte: startDate },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      id: true,
      featureType: true,
      totalTokens: true,
      cost: true,
      createdAt: true,
    },
  });

  // Calculate total views from applications (if job views tracked)
  const viewCount = resumes.reduce((sum, r) => sum + (r as any).views || 0, 0);

  return {
    metrics: {
      totalResumes: resumes.length,
      totalViews: viewCount,
      averageAtsScore: calculateAverage(resumes.map(r => r.atsScore).filter(Boolean)),
      aiCreditsUsed: user?.aiCreditsUsed || 0,
      aiCreditsRemaining: Math.max(0, 
        (user?.aiCredits || 0) + (user?.aiCreditsPurchased || 0) - (user?.aiCreditsUsed || 0)
      ),
    },
    timeSeries: {
      resumes: resumeTimeSeries,
      views: [], // Would need view tracking table
      atsScores: atsTimeSeries,
    },
    topJobs: [], // Would need job applications
    recentActivity: recentAIUsage.map(a => ({
      type: 'ai_usage',
      feature: a.featureType,
      tokens: a.totalTokens,
      cost: a.cost,
      date: a.createdAt,
    })),
  };
}

// ============================================
// ADMIN ANALYTICS IMPLEMENTATION
// ============================================

async function getAdminAnalytics(period: string): Promise<{
  overview: {
    totalUsers: number;
    totalResumes: number;
    totalOrganizations: number;
    activeSubscriptions: number;
  };
  revenue: {
    monthlyRecurringRevenue: number;
    totalRevenue: number;
    churnRate: number;
  };
  usage: {
    totalAIRequests: number;
    totalAITokens: number;
    totalAICost: number;
  };
  growth: {
    newUsers: TimeSeriesData[];
    newResumes: TimeSeriesData[];
  };
  topOrganizations: any[];
}> {
  const startDate = getStartDate(period);

  // Get overview stats
  const [
    totalUsers,
    totalResumes,
    totalOrganizations,
    activeSubscriptions,
    aiStats,
    revenueStats,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.resume.count(),
    prisma.organization.count(),
    prisma.user.count({
      where: {
        subscriptionStatus: 'ACTIVE',
        subscriptionTier: { not: 'FREE' },
      },
    }),
    prisma.aIUsage.aggregate({
      where: { createdAt: { gte: startDate } },
      _count: true,
      _sum: { totalTokens: true, cost: true },
    }),
    // Would need payment/subscription tracking
    Promise.resolve({ total: 0, mrr: 0 }),
  ]);

  // Get user growth over time
  const newUsersOverTime = await prisma.user.groupBy({
    by: ['createdAt'],
    where: { createdAt: { gte: startDate } },
    _count: true,
  });

  // Get resume growth over time
  const newResumesOverTime = await prisma.resume.groupBy({
    by: ['createdAt'],
    where: { createdAt: { gte: startDate } },
    _count: true,
  });

  // Get top organizations
  const topOrgs = await prisma.organization.findMany({
    include: {
      _count: {
        select: { users: true, jobPostings: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return {
    overview: {
      totalUsers,
      totalResumes,
      totalOrganizations,
      activeSubscriptions,
    },
    revenue: {
      monthlyRecurringRevenue: (revenueStats as any).mrr || 0,
      totalRevenue: (revenueStats as any).total || 0,
      churnRate: 0, // Calculate from subscription cancellations
    },
    usage: {
      totalAIRequests: aiStats._count,
      totalAITokens: aiStats._sum.totalTokens || 0,
      totalAICost: aiStats._sum.cost || 0,
    },
    growth: {
      newUsers: aggregateByDate(newUsersOverTime.map(u => ({
        date: u.createdAt.toISOString().split('T')[0],
        value: u._count,
      }))),
      newResumes: aggregateByDate(newResumesOverTime.map(r => ({
        date: r.createdAt.toISOString().split('T')[0],
        value: r._count,
      }))),
    },
    topOrganizations: topOrgs.map(org => ({
      id: org.id,
      name: org.name,
      users: org._count.users,
      jobPostings: org._count.jobPostings,
      tier: org.subscriptionTier,
    })),
  };
}

// ============================================
// RECRUITER ANALYTICS IMPLEMENTATION
// ============================================

async function getRecruiterAnalytics(
  userId: string,
  period: string
): Promise<{
  overview: {
    totalJobs: number;
    totalApplications: number;
    totalViews: number;
    avgMatchScore: number;
  };
  jobPerformance: any[];
  candidatePipeline: any;
  recentActivity: any[];
}> {
  const startDate = getStartDate(period);

  const recruiter = await prisma.recruiterProfile.findUnique({
    where: { userId },
    include: {
      jobPostings: {
        include: {
          applications: {
            select: { id: true, status: true, createdAt: true },
          },
          candidateMatches: {
            select: { matchScore: true },
          },
        },
      },
    },
  });

  if (!recruiter) {
    throw new Error('Recruiter profile not found');
  }

  // Calculate overview stats
  let totalViews = 0;
  let totalMatchScores = 0;
  let matchCount = 0;

  const jobPerformance = recruiter.jobPostings.map(job => {
    totalViews += job.views;
    
    const scores = job.candidateMatches.map(m => m.matchScore);
    if (scores.length > 0) {
      totalMatchScores += scores.reduce((a, b) => a + b, 0);
      matchCount += scores.length;
    }

    return {
      id: job.id,
      title: job.title,
      status: job.status,
      views: job.views,
      applications: job.applications.length,
      avgMatchScore: scores.length > 0 
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
        : null,
      postedAt: job.createdAt,
      closedAt: job.closedAt,
    };
  });

  // Calculate pipeline stages
  const allApplications = recruiter.jobPostings.flatMap(j => j.applications);
  const pipeline = {
    applied: allApplications.filter(a => a.status === 'APPLIED').length,
    screening: allApplications.filter(a => a.status === 'SCREENING').length,
    interview: allApplications.filter(a => a.status === 'INTERVIEW').length,
    offer: allApplications.filter(a => a.status === 'OFFER').length,
    rejected: allApplications.filter(a => a.status === 'REJECTED').length,
  };

  // Get recent activity
  const recentApplications = await prisma.application.findMany({
    where: {
      job: { recruiterId: recruiter.id },
      createdAt: { gte: startDate },
    },
    include: {
      candidate: {
        include: {
          user: { select: { name: true, image: true } },
        },
      },
      job: { select: { title: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return {
    overview: {
      totalJobs: recruiter.jobPostings.length,
      totalApplications: allApplications.length,
      totalViews,
      avgMatchScore: matchCount > 0 ? Math.round(totalMatchScores / matchCount) : 0,
    },
    jobPerformance,
    candidatePipeline: pipeline,
    recentActivity: recentApplications.map(a => ({
      type: 'application',
      candidate: a.candidate.user.name,
      job: a.job.title,
      status: a.status,
      date: a.createdAt,
    })),
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getStartDate(period: string): Date {
  const now = new Date();
  switch (period) {
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case '90d':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    case '1y':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
}

function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return Math.round(numbers.reduce((a, b) => a + b, 0) / numbers.length);
}

async function getResumeTimeSeries(userId: string, startDate: Date): Promise<TimeSeriesData[]> {
  const resumes = await prisma.resume.groupBy({
    by: ['createdAt'],
    where: {
      userId,
      createdAt: { gte: startDate },
    },
    _count: true,
  });

  return aggregateByDate(
    resumes.map(r => ({
      date: r.createdAt.toISOString().split('T')[0],
      value: r._count,
    }))
  );
}

async function getATSScoreTimeSeries(userId: string, startDate: Date): Promise<TimeSeriesData[]> {
  const resumes = await prisma.resume.findMany({
    where: {
      userId,
      createdAt: { gte: startDate },
      atsScore: { not: null },
    },
    select: {
      createdAt: true,
      atsScore: true,
    },
  });

  return resumes.map(r => ({
    date: r.createdAt.toISOString().split('T')[0],
    value: r.atsScore!,
  }));
}

function aggregateByDate(data: { date: string; value: number }[]): TimeSeriesData[] {
  const aggregated = new Map<string, number>();
  
  for (const item of data) {
    const existing = aggregated.get(item.date) || 0;
    aggregated.set(item.date, existing + item.value);
  }

  return Array.from(aggregated.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// ============================================
// EVENT TRACKING
// ============================================

export interface TrackEventInput {
  userId?: string;
  organizationId?: string;
  eventType: string;
  eventName: string;
  properties?: Record<string, any>;
}

export async function trackEvent(input: TrackEventInput): Promise<void> {
  try {
    await prisma.analyticsEvent.create({
      data: {
        userId: input.userId,
        organizationId: input.organizationId,
        eventType: input.eventType,
        eventName: input.eventName,
        properties: input.properties,
      },
    });
  } catch (error) {
    console.error('Failed to track event:', error);
    // Don't throw - analytics should not break the app
  }
}