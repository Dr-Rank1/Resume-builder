// ============================================
// PERFORMANCE INFRASTRUCTURE - REDIS & QUEUE
// Enterprise-grade caching and background job processing
// ============================================

import Redis from 'ioredis';
import { Queue, Worker, Job, QueueEvents } from 'bullmq';

// ============================================
// REDIS CLIENT
// ============================================

// Singleton Redis client
let redisClient: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      reconnectOnError(err) {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
          return true;
        }
        return false;
      },
    });

    redisClient.on('error', (err) => {
      console.error('Redis connection error:', err);
    });

    redisClient.on('connect', () => {
      console.log('Redis connected');
    });
  }

  return redisClient;
}

// ============================================
// CACHE SERVICE
// ============================================

interface CacheOptions {
  ttl?: number; // seconds
  prefix?: string;
}

const DEFAULT_TTL = 3600; // 1 hour

export const cache = {
  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    const redis = getRedisClient();
    try {
      const value = await redis.get(key);
      if (value) {
        return JSON.parse(value) as T;
      }
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  /**
   * Set value in cache
   */
  async set<T>(
    key: string, 
    value: T, 
    options: CacheOptions = {}
  ): Promise<void> {
    const redis = getRedisClient();
    const ttl = options.ttl || DEFAULT_TTL;
    
    try {
      await redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  },

  /**
   * Delete from cache
   */
  async del(key: string): Promise<void> {
    const redis = getRedisClient();
    try {
      await redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  },

  /**
   * Delete multiple keys by pattern
   */
  async delPattern(pattern: string): Promise<void> {
    const redis = getRedisClient();
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error('Cache delPattern error:', error);
    }
  },

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    const redis = getRedisClient();
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  },

  /**
   * Increment value
   */
  async incr(key: string, amount = 1): Promise<number> {
    const redis = getRedisClient();
    try {
      return await redis.incrby(key, amount);
    } catch (error) {
      console.error('Cache incr error:', error);
      return 0;
    }
  },

  /**
   * Decrement value
   */
  async decr(key: string, amount = 1): Promise<number> {
    const redis = getRedisClient();
    try {
      return await redis.decrby(key, amount);
    } catch (error) {
      console.error('Cache decr error:', error);
      return 0;
    }
  },

  /**
   * Get TTL of key
   */
  async ttl(key: string): Promise<number> {
    const redis = getRedisClient();
    try {
      return await redis.ttl(key);
    } catch (error) {
      console.error('Cache ttl error:', error);
      return -1;
    }
  },

  /**
   * Set with NX (only if not exists)
   */
  async setNX<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    const redis = getRedisClient();
    try {
      if (ttl) {
        const result = await redis.set(key, JSON.stringify(value), 'EX', ttl, 'NX');
        return result === 'OK';
      } else {
        const result = await redis.setnx(key, JSON.stringify(value));
        return result === 1;
      }
    } catch (error) {
      console.error('Cache setNX error:', error);
      return false;
    }
  },

  /**
   * Get or set (cache-aside pattern)
   */
  async getOrSet<T>(
    key: string, 
    factory: () => Promise<T>, 
    options: CacheOptions = {}
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    await this.set(key, value, options);
    return value;
  },

  /**
   * Cache with locking (prevent thundering herd)
   */
  async withLock<T>(
    key: string,
    factory: () => Promise<T>,
    lockTTL = 30
  ): Promise<T> {
    const lockKey = `${key}:lock`;
    const lockValue = Date.now().toString();

    // Try to acquire lock
    const acquired = await this.setNX(lockKey, lockValue, lockTTL);
    
    if (acquired) {
      try {
        // Execute factory
        const result = await factory();
        
        // Cache the result
        await this.set(key, result, { ttl: 300 }); // 5 min default
        
        return result;
      } finally {
        // Release lock
        await this.del(lockKey);
      }
    }

    // Lock not acquired, wait and retry get
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Still no value, wait longer and try again
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const retry = await this.get<T>(key);
    if (retry !== null) {
      return retry;
    }

    // Last resort - execute without lock
    return factory();
  },
};

// ============================================
// RATE LIMITER
// ============================================

interface RateLimitConfig {
  max: number;
  window: number; // seconds
  prefix?: string;
}

export function createRateLimiter(config: RateLimitConfig) {
  const redis = getRedisClient();
  const { max, window, prefix = 'ratelimit' } = config;

  return async function rateLimit(
    identifier: string,
    increment = 1
  ): Promise<{ allowed: boolean; remaining: number; reset: number }> {
    const key = `${prefix}:${identifier}`;
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - window;

    try {
      // Remove old entries
      await redis.zremrangebyscore(key, 0, windowStart);

      // Count current requests
      const count = await redis.zcard(key);

      if (count >= max) {
        // Get oldest entry to calculate reset time
        const oldest = await redis.zrange(key, 0, 0, 'WITHSCORES');
        const reset = oldest.length >= 2 
          ? parseInt(oldest[1], 10) + window 
          : now + window;

        return {
          allowed: false,
          remaining: 0,
          reset,
        };
      }

      // Add new request
      await redis.zadd(key, now, `${now}:${Math.random()}`);
      await redis.expire(key, window);

      return {
        allowed: true,
        remaining: max - count - increment,
        reset: now + window,
      };
    } catch (error) {
      console.error('Rate limit error:', error);
      // Fail open (allow request on error)
      return { allowed: true, remaining: max, reset: now + window };
    }
  };
}

// ============================================
// BULLMQ QUEUES
// ============================================

// Queue names
export const QUEUE_NAMES = {
  AI_PROCESSING: 'ai-processing',
  EMAIL: 'email',
  NOTIFICATIONS: 'notifications',
  ANALYTICS: 'analytics',
  EXPORT: 'export',
  MATCHING: 'matching',
} as const;

// Connection config for BullMQ
const queueConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
};

// ============================================
// AI PROCESSING QUEUE
// ============================================

export const aiQueue = new Queue(QUEUE_NAMES.AI_PROCESSING, {
  connection: queueConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      age: 3600, // 1 hour
      count: 1000,
    },
    removeOnFail: {
      age: 86400, // 24 hours
      count: 5000,
    },
  },
});

// Add jobs to AI queue
export async function queueAIJob(
  type: string,
  data: Record<string, any>,
  priority = 0
) {
  return aiQueue.add(type, data, {
    priority,
    jobId: `${type}:${data.userId}:${Date.now()}`,
  });
}

// ============================================
// EMAIL QUEUE
// ============================================

export const emailQueue = new Queue(QUEUE_NAMES.EMAIL, {
  connection: queueConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: {
      age: 3600,
      count: 500,
    },
    removeOnFail: {
      age: 86400,
      count: 2000,
    },
  },
});

export async function queueEmail(
  to: string,
  subject: string,
  template: string,
  data: Record<string, any>
) {
  return emailQueue.add('send-email', {
    to,
    subject,
    template,
    data,
  }, {
    jobId: `email:${to}:${Date.now()}`,
  });
}

// ============================================
// NOTIFICATIONS QUEUE
// ============================================

export const notificationsQueue = new Queue(QUEUE_NAMES.NOTIFICATIONS, {
  connection: queueConnection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'fixed',
      delay: 1000,
    },
    removeOnComplete: {
      age: 3600,
      count: 1000,
    },
    removeOnFail: {
      age: 86400,
      count: 5000,
    },
  },
});

export async function queueNotification(
  userId: string,
  type: string,
  title: string,
  body: string,
  data?: Record<string, any>
) {
  return notificationsQueue.add('send-notification', {
    userId,
    type,
    title,
    body,
    data,
  }, {
    jobId: `notification:${userId}:${Date.now()}`,
  });
}

// ============================================
// ANALYTICS QUEUE
// ============================================

export const analyticsQueue = new Queue(QUEUE_NAMES.ANALYTICS, {
  connection: queueConnection,
  defaultJobOptions: {
    attempts: 1,
    removeOnComplete: false,
    removeOnFail: {
      age: 86400,
      count: 10000,
    },
  },
});

export async function queueAnalyticsEvent(
  eventType: string,
  eventName: string,
  properties?: Record<string, any>
) {
  return analyticsQueue.add('track-event', {
    eventType,
    eventName,
    properties,
    timestamp: new Date().toISOString(),
  }, {
    jobId: `analytics:${eventName}:${Date.now()}`,
  });
}

// ============================================
// EXPORT QUEUE
// ============================================

export const exportQueue = new Queue(QUEUE_NAMES.EXPORT, {
  connection: queueConnection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: {
      age: 3600,
      count: 100,
    },
    removeOnFail: {
      age: 86400,
      count: 500,
    },
  },
});

export async function queueExport(
  userId: string,
  resumeId: string,
  format: 'pdf' | 'docx' | 'json'
) {
  return exportQueue.add('export-resume', {
    userId,
    resumeId,
    format,
  }, {
    jobId: `export:${resumeId}:${format}:${Date.now()}`,
  });
}

// ============================================
// MATCHING QUEUE
// ============================================

export const matchingQueue = new Queue(QUEUE_NAMES.MATCHING, {
  connection: queueConnection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 3000,
    },
    removeOnComplete: {
      age: 7200,
      count: 500,
    },
    removeOnFail: {
      age: 86400,
      count: 2000,
    },
  },
});

export async function queueCandidateMatching(
  jobId: string,
  candidateIds: string[]
) {
  return matchingQueue.add('match-candidates', {
    jobId,
    candidateIds,
  }, {
    jobId: `match:${jobId}:${Date.now()}`,
    priority: 5,
  });
}

// ============================================
// QUEUE EVENTS & MONITORING
// ============================================

export function setupQueueEvents() {
  const queues = [aiQueue, emailQueue, notificationsQueue, analyticsQueue, exportQueue, matchingQueue];

  const queueEvents = new QueueEvents(QUEUE_NAMES.AI_PROCESSING, {
    connection: queueConnection,
  });

  queueEvents.on('completed', ({ jobId, returnvalue }) => {
    console.log(`Job ${jobId} completed with result:`, returnvalue);
  });

  queueEvents.on('failed', ({ jobId, failedReason }) => {
    console.error(`Job ${jobId} failed:`, failedReason);
  });

  queueEvents.on('progress', ({ jobId, progress }) => {
    console.log(`Job ${jobId} progress:`, progress);
  });

  return () => {
    queueEvents.close();
  };
}

// ============================================
// QUEUE STATUS CHECKS
// ============================================

export async function getQueueStats() {
  const stats: Record<string, any> = {};

  for (const queueName of Object.values(QUEUE_NAMES)) {
    const queue = new Queue(queueName, { connection: queueConnection });
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
    ]);

    stats[queueName] = {
      waiting,
      active,
      completed,
      failed,
      delayed,
    };
  }

  return stats;
}

// ============================================
// SESSION STORE (Redis)
// ============================================

interface SessionData {
  userId: string;
  expires: number;
  data: Record<string, any>;
}

export const sessionStore = {
  async get(key: string): Promise<SessionData | null> {
    return cache.get<SessionData>(`session:${key}`);
  },

  async set(key: string, data: SessionData, ttl = 86400): Promise<void> {
    await cache.set(`session:${key}`, data, { ttl });
  },

  async del(key: string): Promise<void> {
    await cache.del(`session:${key}`);
  },

  async touch(key: string, ttl = 86400): Promise<void> {
    const redis = getRedisClient();
    await redis.expire(`session:${key}`, ttl);
  },
};

// ============================================
// DISTRIBUTED LOCKS
// ============================================

export async function acquireLock(
  name: string,
  ttl = 30
): Promise<{ acquired: boolean; release: () => Promise<void> }> {
  const lockKey = `lock:${name}`;
  const lockValue = Date.now().toString();

  const acquired = await cache.setNX(lockKey, lockValue, ttl);

  return {
    acquired,
    release: async () => {
      await cache.del(lockKey);
    },
  };
}

// ============================================
// DATA PREFETCHING
// ============================================

interface PrefetchOptions {
  ttl?: number;
  parallel?: boolean;
}

export async function prefetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: PrefetchOptions = {}
): Promise<T> {
  const { ttl = 300, parallel = true } = options;

  const cached = await cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  if (parallel) {
    // Start prefetch in background
    setImmediate(async () => {
      const data = await fetchFn();
      await cache.set(key, data, { ttl });
    });
    
    // Return partial result or placeholder
    return fetchFn();
  }

  return fetchFn();
}

// ============================================
// DATABASE QUERY CACHING
// ============================================

export function cachedQuery<T>(
  key: string,
  fn: () => Promise<T>,
  ttl = 300
): () => Promise<T> {
  return async () => {
    return cache.getOrSet<T>(key, fn, { ttl });
  };
}

// Clear query cache when data changes
export async function invalidateQueryCache(pattern: string) {
  await cache.delPattern(`query:${pattern}*`);
}

// ============================================
// CLEANUP
// ============================================

export async function cleanup() {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}