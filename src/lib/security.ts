// ============================================
// SECURITY HARDENING - MIDDLEWARE & UTILITIES
// Enterprise-grade security for API routes
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createRateLimiter } from '@/lib/infrastructure/redis';
import { z } from 'zod';

// ============================================
// RATE LIMITING
// ============================================

// Rate limit configurations for different endpoints
const rateLimits = {
  // AI endpoints - stricter limits
  ai: createRateLimiter({ max: 30, window: 60, prefix: 'rl:ai' }),
  
  // Auth endpoints
  auth: createRateLimiter({ max: 10, window: 60, prefix: 'rl:auth' }),
  
  // API endpoints
  api: createRateLimiter({ max: 100, window: 60, prefix: 'rl:api' }),
  
  // File uploads
  upload: createRateLimiter({ max: 20, window: 60, prefix: 'rl:upload' }),
  
  // Search endpoints
  search: createRateLimiter({ max: 50, window: 60, prefix: 'rl:search' }),
  
  // Webhooks (Stripe)
  webhook: createRateLimiter({ max: 100, window: 60, prefix: 'rl:webhook' }),
};

/**
 * Apply rate limiting to API route
 */
export async function applyRateLimit(
  request: NextRequest,
  type: keyof typeof rateLimits,
  identifier?: string
): Promise<{ allowed: boolean; headers: Record<string, string> }> {
  const id = identifier || request.ip || 'unknown';
  const result = await rateLimits[type](id);

  return {
    allowed: result.allowed,
    headers: {
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': result.reset.toString(),
      'X-RateLimit-Limit': '100', // Should match config
    },
  };
}

/**
 * Rate limit middleware wrapper
 */
export function withRateLimit(
  handler: (request: NextRequest, context: any) => Promise<NextResponse>,
  type: keyof typeof rateLimits
) {
  return async (request: NextRequest, context?: any) => {
    const { allowed, headers } = await applyRateLimit(request, type);
    
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            ...headers,
            'Retry-After': '60',
          },
        }
      );
    }

    const response = await handler(request, context);
    
    // Add rate limit headers to response
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  };
}

// ============================================
// INPUT SANITIZATION
// ============================================

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(input: string): string {
  if (!input) return '';
  
  return input
    // Remove null bytes
    .replace(/\0/g, '')
    // Trim whitespace
    .trim()
    // Remove or escape dangerous characters
    .replace(/[<>'"&]/g, (char) => {
      const entities: Record<string, string> = {
        '<': '<',
        '>': '>',
        "'": '&#x27;',
        '"': '"',
        '&': '&',
      };
      return entities[char] || char;
    });
}

/**
 * Sanitize for SQL-like injection (defense in depth - Prisma handles this)
 */
export function sanitizeSQL(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/'/g, "''")
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '');
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename: string): string {
  if (!filename) return '';
  
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.\./g, '_')
    .replace(/\/+/g, '_')
    .slice(0, 255);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 320;
}

/**
 * Validate URL format
 */
export function isValidURL(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

// ============================================
// PROMPT INJECTION PREVENTION
// ============================================

/**
 * Patterns that might indicate prompt injection
 */
const INJECTION_PATTERNS = [
  /\[(SYSTEM|USER|ASSISTANT)\]/gi,
  /<\|.*?\|>/gi,
  /role:\s*(system|user|assistant)/gi,
  /ignore (previous|above|all) instructions/gi,
  /you (are|should) now/gi,
  /forget (everything|all previous)/gi,
  /disregard (your|previous)/gi,
  /new (instructions?|rules?)/gi,
  /swap (system|context)/gi,
  /\b(execute|run|do)\s*(code|command|script)/gi,
  /\{.*?(system|instructions?).*\}/gi,
];

const INJECTION_KEYWORDS = [
  'ignore',
  'disregard',
  'forget',
  'override',
  'bypass',
  'injection',
  'prompt',
  'exploit',
];

/**
 * Check for potential prompt injection
 */
export function detectPromptInjection(input: string): {
  isSuspicious: boolean;
  reason?: string;
} {
  // Check patterns
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      return {
        isSuspicious: true,
        reason: 'Detected potential instruction override pattern',
      };
    }
  }

  // Check for suspicious keywords
  const lowerInput = input.toLowerCase();
  for (const keyword of INJECTION_KEYWORDS) {
    if (lowerInput.includes(keyword) && lowerInput.includes('instruction')) {
      return {
        isSuspicious: true,
        reason: `Suspicious keyword combination detected: "${keyword}"`,
      };
    }
  }

  // Check for repeated special characters (potential obfuscation)
  if (/[<>{}]{5,}/.test(input)) {
    return {
      isSuspicious: true,
      reason: 'Too many special characters detected',
    };
  }

  // Check for unusual encoding
  if (/%[0-9a-fA-F]{2}%[0-9a-fA-F]{2}/.test(input)) {
    return {
      isSuspicious: true,
      reason: 'URL encoding detected - possible obfuscation',
    };
  }

  return { isSuspicious: false };
}

/**
 * Sanitize input for AI processing
 */
export function sanitizeAIInput(input: string, maxLength = 10000): string {
  if (!input) return '';

  // Check for injection
  const injectionCheck = detectPromptInjection(input);
  if (injectionCheck.isSuspicious) {
    console.warn(`Prompt injection detected: ${injectionCheck.reason}`);
    // Still sanitize but log the attempt
  }

  return input
    .slice(0, maxLength)
    .replace(/\0/g, '')
    .replace(/\[(SYSTEM|USER|ASSISTANT)\]/gi, '')
    .replace(/<\|.*?\|>/g, '')
    .replace(/```/g, '')
    .trim();
}

// ============================================
// CSRF PROTECTION
// ============================================

/**
 * Validate CSRF token
 */
export function validateCSRFToken(
  request: NextRequest,
  secret: string
): boolean {
  const token = request.headers.get('x-csrf-token');
  const cookieToken = request.cookies.get('csrf_token')?.value;

  if (!token || !cookieToken) {
    return false;
  }

  // Simple token comparison (in production use crypto)
  return token === cookieToken;
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  // In production, use crypto.randomBytes
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// ============================================
// CONTENT SECURITY POLICY
// ============================================

export function getSecurityHeaders(): Record<string, string> {
  return {
    // Prevent XSS
    'X-XSS-Protection': '1; mode=block',
    'X-Content-Type-Options': 'nosniff',
    
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    
    // Force HTTPS
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    
    // Content Security Policy
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self' https://api.stripe.com",
      "frame-src 'none'",
    ].join('; '),
    
    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Permissions policy
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };
}

// ============================================
// FILE UPLOAD SECURITY
// ============================================

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'text/plain',
];

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.txt'];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface FileValidationResult {
  valid: boolean;
  error?: string;
  sanitizedFilename?: string;
}

/**
 * Validate file upload
 */
export function validateFileUpload(file: {
  name: string;
  type: string;
  size: number;
}): FileValidationResult {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'File type not allowed',
    };
  }

  // Check extension
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: 'File extension not allowed',
    };
  }

  // Sanitize filename
  const sanitizedFilename = sanitizeFilename(file.name);

  return {
    valid: true,
    sanitizedFilename,
  };
}

/**
 * Validate image upload specifically
 */
export function validateImageUpload(file: {
  name: string;
  type: string;
  size: number;
}): FileValidationResult {
  const imageTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxImageSize = 5 * 1024 * 1024; // 5MB

  if (!imageTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Only JPEG, PNG, and WebP images are allowed',
    };
  }

  if (file.size > maxImageSize) {
    return {
      valid: false,
      error: 'Image size exceeds maximum of 5MB',
    };
  }

  return {
    valid: true,
    sanitizedFilename: sanitizeFilename(file.name),
  };
}

// ============================================
// API VALIDATION SCHEMAS
// ============================================

export const validationSchemas = {
  // Resume section validation
  resumeSection: z.object({
    type: z.enum(['SUMMARY', 'EXPERIENCE', 'EDUCATION', 'SKILLS', 'PROJECTS', 'CERTIFICATIONS', 'LANGUAGES']),
    title: z.string().max(100).optional(),
    content: z.any(),
    order: z.number().int().min(0).max(20),
    isVisible: z.boolean(),
  }),

  // User profile validation
  userProfile: z.object({
    name: z.string().min(1).max(100).optional(),
    email: z.string().email().max(320),
    image: z.string().url().optional(),
  }),

  // Job posting validation
  jobPosting: z.object({
    title: z.string().min(3).max(200),
    description: z.string().min(50).max(10000),
    requirements: z.string().min(20).max(10000),
    benefits: z.string().max(5000).optional(),
    department: z.string().max(100).optional(),
    employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']),
    experienceLevel: z.enum(['ENTRY', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE']),
    location: z.string().max(200).optional(),
    remoteType: z.enum(['ON_SITE', 'REMOTE', 'HYBRID']).optional(),
    salaryMin: z.number().int().min(0).optional(),
    salaryMax: z.number().int().min(0).optional(),
  }),

  // AI request validation
  aiRequest: z.object({
    type: z.enum(['BULLET_GENERATOR', 'RESUME_REWRITER', 'JOB_PARSER', 'ATS_MATCHING', 'INTERVIEW_COACH']),
    data: z.record(z.any()),
  }),
};

/**
 * Validate request body against schema
 */
export function validateRequest<T>(
  data: unknown,
  schema: z.ZodSchema<T>
): { valid: boolean; data?: T; errors?: z.ZodError } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { valid: true, data: result.data };
  }
  
  return { valid: false, errors: result.error };
}

// ============================================
// IP BLOCKING / REPUTATION
// ============================================

interface SuspiciousActivity {
  score: number;
  reasons: string[];
}

const SUSPICIOUS_PATTERNS = [
  { pattern: /\bbot\b/i, weight: 0.3 },
  { pattern: /crawl|spider|scraper/i, weight: 0.3 },
  { pattern: /^::1$|^127\./, weight: 0.1 },
];

/**
 * Check for suspicious request patterns
 */
export function checkSuspiciousActivity(request: NextRequest): SuspiciousActivity {
  const userAgent = request.headers.get('user-agent') || '';
  const ip = request.ip || '';
  
  let score = 0;
  const reasons: string[] = [];

  for (const { pattern, weight } of SUSPICIOUS_PATTERNS) {
    if (pattern.test(userAgent) || pattern.test(ip)) {
      score += weight;
      reasons.push(`Matched pattern: ${pattern}`);
    }
  }

  // Check for missing common headers
  if (!request.headers.get('accept')) {
    score += 0.1;
    reasons.push('Missing Accept header');
  }

  return { score, reasons };
}

// ============================================
// SECURE RESPONSE HELPERS
// ============================================

/**
 * Create a secure JSON response
 */
export function secureResponse<T>(
  data: T,
  options: {
    status?: number;
    cache?: boolean;
    cors?: boolean;
  } = {}
): NextResponse {
  const { status = 200, cache = false, cors = false } = options;

  const response = NextResponse.json(data, { status });

  // Apply security headers
  const headers = getSecurityHeaders();
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Cache control
  if (!cache) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
  }

  // CORS headers (if needed)
  if (cors) {
    response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  return response;
}

/**
 * Create error response (without leaking details)
 */
export function errorResponse(
  message: string,
  status = 500,
  details?: string // Only in development
): NextResponse {
  const error = {
    error: message,
    ...(process.env.NODE_ENV === 'development' && details && { details }),
    code: status,
  };

  const response = NextResponse.json(error, { status });

  // Apply security headers
  const headers = getSecurityHeaders();
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

// ============================================
// AUDIT LOGGING
// ============================================

export interface AuditLogEntry {
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  ip: string;
  userAgent: string;
  success: boolean;
  details?: Record<string, any>;
}

/**
 * Log security event (would connect to SIEM in production)
 */
export function logSecurityEvent(entry: AuditLogEntry) {
  const logEntry = {
    type: 'SECURITY',
    timestamp: new Date().toISOString(),
    ...entry,
  };

  // In production, send to SIEM, CloudWatch, etc.
  console.log(JSON.stringify(logEntry));

  // Could also store in database
  // await prisma.securityLog.create({ data: logEntry });
}

// ============================================
// HELPER: GET CLIENT INFO
// ============================================

export function getClientInfo(request: NextRequest) {
  return {
    ip: request.headers.get('x-forwarded-for')?.split(',')[0] || request.ip || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
    country: request.headers.get('cf-ipcountry') || 'unknown', // Cloudflare
  };
}

// ============================================
// API KEY VALIDATION
// ============================================

export function validateAPIKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key');
  
  if (!apiKey) {
    return false;
  }

  // In production, validate against stored keys
  const validKeys = process.env.VALID_API_KEYS?.split(',') || [];
  
  return validKeys.includes(apiKey);
}