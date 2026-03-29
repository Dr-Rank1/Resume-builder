// ============================================
// ROLE-BASED ACCESS CONTROL (RBAC) SYSTEM
// Multi-tenant authorization with granular permissions
// ============================================

import { PrismaClient, UserRole } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// ============================================
// PERMISSION DEFINITIONS
// ============================================

export enum Permission {
  // Resume permissions
  RESUME_CREATE = 'resume:create',
  RESUME_READ = 'resume:read',
  RESUME_UPDATE = 'resume:update',
  RESUME_DELETE = 'resume:delete',
  RESUME_SHARE = 'resume:share',
  RESUME_ANALYZE = 'resume:analyze',
  
  // AI permissions
  AI_BULLET_GENERATE = 'ai:bullet:generate',
  AI_RESUME_REWRITE = 'ai:resume:rewrite',
  AI_JOB_PARSE = 'ai:job:parse',
  AI_ATS_MATCH = 'ai:ats:match',
  AI_INTERVIEW_COACH = 'ai:interview:coach',
  AI_CREDITS_PURCHASE = 'ai:credits:purchase',
  
  // Job posting permissions (recruiter)
  JOB_CREATE = 'job:create',
  JOB_READ = 'job:read',
  JOB_UPDATE = 'job:update',
  JOB_DELETE = 'job:delete',
  JOB_PUBLISH = 'job:publish',
  JOB_CLOSE = 'job:close',
  
  // Candidate permissions (recruiter)
  CANDIDATE_SEARCH = 'candidate:search',
  CANDIDATE_VIEW = 'candidate:view',
  CANDIDATE_SAVE = 'candidate:save',
  CANDIDATE_MATCH = 'candidate:match',
  
  // Application permissions
  APPLICATION_CREATE = 'application:create',
  APPLICATION_READ = 'application:read',
  APPLICATION_UPDATE = 'application:update',
  
  // Organization permissions
  ORG_MANAGE_USERS = 'org:manage:users',
  ORG_MANAGE_RECRUITERS = 'org:manage:recruiters',
  ORG_MANAGE_BILLING = 'org:manage:billing',
  ORG_VIEW_ANALYTICS = 'org:view:analytics',
  ORG_SETTINGS = 'org:settings',
  
  // Admin permissions
  ADMIN_USERS = 'admin:users',
  ADMIN_ORGANIZATIONS = 'admin:organizations',
  ADMIN_BILLING = 'admin:billing',
  ADMIN_SYSTEM = 'admin:system',
  ADMIN_AUDIT = 'admin:audit',
}

// ============================================
// ROLE-PERMISSION MAPPING
// ============================================

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.USER]: [
    Permission.RESUME_CREATE,
    Permission.RESUME_READ,
    Permission.RESUME_UPDATE,
    Permission.RESUME_DELETE,
    Permission.RESUME_SHARE,
    Permission.RESUME_ANALYZE,
    Permission.AI_BULLET_GENERATE,
    Permission.AI_RESUME_REWRITE,
    Permission.AI_JOB_PARSE,
    Permission.AI_CREDITS_PURCHASE,
    Permission.APPLICATION_CREATE,
    Permission.APPLICATION_READ,
    Permission.ORG_VIEW_ANALYTICS,
  ],
  
  [UserRole.RECRUITER]: [
    Permission.RESUME_READ,
    Permission.RESUME_SHARE,
    Permission.JOB_CREATE,
    Permission.JOB_READ,
    Permission.JOB_UPDATE,
    Permission.JOB_DELETE,
    Permission.JOB_PUBLISH,
    Permission.JOB_CLOSE,
    Permission.CANDIDATE_SEARCH,
    Permission.CANDIDATE_VIEW,
    Permission.CANDIDATE_SAVE,
    Permission.CANDIDATE_MATCH,
    Permission.AI_ATS_MATCH,
    Permission.AI_JOB_PARSE,
    Permission.APPLICATION_READ,
    Permission.APPLICATION_UPDATE,
    Permission.ORG_VIEW_ANALYTICS,
    Permission.ORG_MANAGE_BILLING,
  ],
  
  [UserRole.ADMIN]: [
    // All user permissions
    Permission.RESUME_CREATE,
    Permission.RESUME_READ,
    Permission.RESUME_UPDATE,
    Permission.RESUME_DELETE,
    Permission.RESUME_SHARE,
    Permission.RESUME_ANALYZE,
    Permission.AI_BULLET_GENERATE,
    Permission.AI_RESUME_REWRITE,
    Permission.AI_JOB_PARSE,
    Permission.AI_CREDITS_PURCHASE,
    Permission.APPLICATION_CREATE,
    Permission.APPLICATION_READ,
    // Organization management
    Permission.ORG_MANAGE_USERS,
    Permission.ORG_MANAGE_RECRUITERS,
    Permission.ORG_MANAGE_BILLING,
    Permission.ORG_VIEW_ANALYTICS,
    Permission.ORG_SETTINGS,
  ],
  
  [UserRole.SUPER_ADMIN]: [
    // All permissions
    ...Object.values(Permission),
  ],
};

// ============================================
// TIER-BASED FEATURE ACCESS
// ============================================

export enum SubscriptionTier {
  FREE = 'FREE',
  PRO = 'PRO',
  PREMIUM = 'PREMIUM',
}

export const TIER_FEATURES = {
  [SubscriptionTier.FREE]: {
    resumes: 3,
    aiCredits: 10,
    atsMatching: false,
    interviewCoach: false,
    advancedTemplates: false,
    analytics: 'basic',
    support: 'email',
  },
  [SubscriptionTier.PRO]: {
    resumes: -1, // unlimited
    aiCredits: 100,
    atsMatching: true,
    interviewCoach: false,
    advancedTemplates: true,
    analytics: 'advanced',
    support: 'priority',
  },
  [SubscriptionTier.PREMIUM]: {
    resumes: -1,
    aiCredits: -1,
    atsMatching: true,
    interviewCoach: true,
    advancedTemplates: true,
    analytics: 'premium',
    support: 'dedicated',
  },
};

// ============================================
// ACCESS CONTEXT
// ============================================

export interface AccessContext {
  userId: string;
  organizationId?: string;
  role: UserRole;
  tier: SubscriptionTier;
}

// ============================================
// PERMISSION CHECKER CLASS
// ============================================

export class PermissionChecker {
  private context: AccessContext;
  private userPermissions: Set<Permission>;
  private tierFeatures: typeof TIER_FEATURES[keyof typeof TIER_FEATURES];

  constructor(context: AccessContext) {
    this.context = context;
    this.userPermissions = new Set(ROLE_PERMISSIONS[context.role] || []);
    this.tierFeatures = TIER_FEATURES[context.tier] || TIER_FEATURES[SubscriptionTier.FREE];
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(permission: Permission): boolean {
    return this.userPermissions.has(permission);
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(...permissions: Permission[]): boolean {
    return permissions.some(p => this.userPermissions.has(p));
  }

  /**
   * Check if user has all of the specified permissions
   */
  hasAllPermissions(...permissions: Permission[]): boolean {
    return permissions.every(p => this.userPermissions.has(p));
  }

  /**
   * Check if user has access to a feature based on their tier
   */
  hasFeature(feature: keyof typeof TIER_FEATURES[keyof typeof TIER_FEATURES]): boolean {
    const value = this.tierFeatures[feature];
    // For boolean features, return the value
    // For other types (numbers, strings), check if truthy
    if (typeof value === 'boolean') {
      return value;
    }
    return !!value;
  }

  /**
   * Check if user can perform action based on resource ownership
   */
  async canAccessResource(
    resourceType: 'resume' | 'job' | 'application',
    resourceId: string,
    action: 'read' | 'update' | 'delete'
  ): Promise<boolean> {
    // Admins and super admins can access anything in their org
    if (this.context.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    if (this.context.role === UserRole.ADMIN) {
      return true;
    }

    switch (resourceType) {
      case 'resume': {
        const resume = await prisma.resume.findUnique({
          where: { id: resourceId },
          select: { userId: true, organizationId: true },
        });
        
        if (!resume) return false;
        
        // Users can access their own resumes
        if (resume.userId === this.context.userId) {
          return true;
        }
        
        // Org admins can access org resumes
        if (this.context.organizationId && resume.organizationId === this.context.organizationId) {
          return this.context.role === UserRole.ADMIN;
        }
        
        // Public resumes can be viewed
        if (action === 'read') {
          return true;
        }
        
        return false;
      }

      case 'job': {
        const job = await prisma.jobPosting.findUnique({
          where: { id: resourceId },
          select: { recruiterId: true, organizationId: true },
        });
        
        if (!job) return false;
        
        // Recruiter can access their own jobs
        if (this.context.role === UserRole.RECRUITER) {
          return true;
        }
        
        // Org admins can access org jobs
        if (this.context.organizationId && job.organizationId === this.context.organizationId) {
          return this.context.role === UserRole.ADMIN;
        }
        
        // Published jobs can be viewed by anyone
        if (action === 'read') {
          return true;
        }
        
        return false;
      }

      case 'application': {
        const application = await prisma.application.findUnique({
          where: { id: resourceId },
          include: {
            job: {
              select: { recruiterId: true, organizationId: true },
            },
          },
        });
        
        if (!application) return false;
        
        // Candidate can access their own application
        const candidate = await prisma.candidateProfile.findUnique({
          where: { userId: this.context.userId },
        });
        
        if (candidate && application.candidateId === candidate.id) {
          return true;
        }
        
        // Recruiter can access applications for their jobs
        if (application.job.recruiterId === this.context.userId) {
          return true;
        }
        
        // Org admins can access org applications
        if (this.context.organizationId && application.job.organizationId === this.context.organizationId) {
          return this.context.role === UserRole.ADMIN;
        }
        
        return false;
      }

      default:
        return false;
    }
  }

  /**
   * Get resource-specific query filters
   */
  getResourceFilters(resourceType: 'resume' | 'job' | 'candidate'): any {
    switch (resourceType) {
      case 'resume':
        if (this.context.role === UserRole.SUPER_ADMIN) {
          return {}; // All resumes
        }
        if (this.context.role === UserRole.ADMIN && this.context.organizationId) {
          return { organizationId: this.context.organizationId };
        }
        // Regular users see only their own
        return { userId: this.context.userId };

      case 'job':
        if (this.context.role === UserRole.RECRUITER) {
          return {}; // Will be filtered by recruiter ID in query
        }
        if (this.context.role === UserRole.SUPER_ADMIN) {
          return {};
        }
        if (this.context.organizationId) {
          return { organizationId: this.context.organizationId };
        }
        // For public viewing
        return { status: 'PUBLISHED' };

      case 'candidate':
        // Everyone can search candidates
        return {};

      default:
        return {};
    }
  }
}

// ============================================
// MIDDLEWARE & HELPERS
// ============================================

/**
 * Create permission checker for current session
 */
export async function createPermissionChecker(): Promise<PermissionChecker> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      role: true,
      organizationId: true,
      subscriptionTier: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return new PermissionChecker({
    userId: user.id,
    organizationId: user.organizationId || undefined,
    role: user.role as UserRole,
    tier: (user.subscriptionTier as SubscriptionTier) || SubscriptionTier.FREE,
  });
}

/**
 * Require specific permission
 */
export async function requirePermission(permission: Permission): Promise<PermissionChecker> {
  const checker = await createPermissionChecker();
  
  if (!checker.hasPermission(permission)) {
    throw new Error(`Permission denied: ${permission}`);
  }
  
  return checker;
}

/**
 * Require specific role
 */
export async function requireRole(...roles: UserRole[]): Promise<PermissionChecker> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || !roles.includes(user.role as UserRole)) {
    throw new Error(`Role required: ${roles.join(' or ')}`);
  }

  return createPermissionChecker();
}

/**
 * Require organization membership
 */
export async function requireOrganization(organizationId?: string): Promise<string> {
  const checker = await createPermissionChecker();
  
  if (!checker.context.organizationId && !organizationId) {
    throw new Error('Organization required');
  }
  
  const targetOrg = organizationId || checker.context.organizationId;
  
  if (checker.context.role !== UserRole.SUPER_ADMIN && targetOrg !== checker.context.organizationId) {
    throw new Error('Organization access denied');
  }
  
  return targetOrg!;
}

// ============================================
// DECORATOR-STYLE GUARDS
// ============================================

type GuardFunction = (checker: PermissionChecker) => boolean | Promise<boolean>;

export function createPermissionGuard(permission: Permission): GuardFunction {
  return (checker: PermissionChecker) => checker.hasPermission(permission);
}

export function createFeatureGuard(feature: keyof typeof TIER_FEATURES[keyof typeof TIER_FEATURES]): GuardFunction {
  return (checker: PermissionChecker) => checker.hasFeature(feature);
}

export function combineGuards(...guards: GuardFunction[]): GuardFunction {
  return (checker: PermissionChecker) => {
    for (const guard of guards) {
      const result = guard(checker);
      if (typeof result === 'boolean' && !result) {
        return false;
      }
    }
    return true;
  };
}

// ============================================
// API ROUTE PROTECTION
// ============================================

export interface RouteConfig {
  permissions?: Permission[];
  features?: (keyof typeof TIER_FEATURES[keyof typeof TIER_FEATURES])[];
  roles?: UserRole[];
  organizationRequired?: boolean;
}

export async function protectRoute(config: RouteConfig): Promise<PermissionChecker> {
  const checker = await createPermissionChecker();

  // Check role requirements
  if (config.roles && !config.roles.includes(checker.context.role)) {
    throw new Error(`Insufficient role. Required: ${config.roles.join(', ')}`);
  }

  // Check permission requirements
  if (config.permissions) {
    for (const permission of config.permissions) {
      if (!checker.hasPermission(permission)) {
        throw new Error(`Permission denied: ${permission}`);
      }
    }
  }

  // Check feature requirements
  if (config.features) {
    for (const feature of config.features) {
      if (!checker.hasFeature(feature)) {
        throw new Error(`Feature not available: ${feature}`);
      }
    }
  }

  // Check organization requirement
  if (config.organizationRequired && !checker.context.organizationId) {
    throw new Error('Organization membership required');
  }

  return checker;
}

// ============================================
// AUDIT LOGGING
// ============================================

export async function logAuditEvent(
  userId: string,
  action: string,
  resourceType: string,
  resourceId: string,
  metadata?: Record<string, any>
) {
  // In production, this would write to an audit log table
  console.log(`[AUDIT] User ${userId} performed ${action} on ${resourceType}:${resourceId}`, metadata);
  
  // Could also store in database:
  // await prisma.auditLog.create({
  //   data: {
  //     userId,
  //     action,
  //     resourceType,
  //     resourceId,
  //     metadata,
  //     timestamp: new Date(),
  //   },
  // });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case UserRole.USER:
      return 'User';
    case UserRole.RECRUITER:
      return 'Recruiter';
    case UserRole.ADMIN:
      return 'Organization Admin';
    case UserRole.SUPER_ADMIN:
      return 'Super Admin';
    default:
      return 'Unknown';
  }
}

export function getPermissionsByRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

export function getAvailableFeatures(tier: SubscriptionTier): string[] {
  const features = TIER_FEATURES[tier];
  if (!features) return [];
  
  return Object.entries(features)
    .filter(([, value]) => value === true || typeof value === 'number')
    .map(([key]) => key);
}