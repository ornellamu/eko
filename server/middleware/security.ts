import { Request, Response, NextFunction } from 'express';

// In-memory sliding window rate limiter
interface RateLimitRecord {
  timestamps: number[];
}

const ipRequestMap = new Map<string, RateLimitRecord>();

/**
 * Clean up old rate limit records periodically
 */
setInterval(() => {
  const now = Date.now();
  const oneMinuteAgo = now - 60 * 1000;
  for (const [key, record] of ipRequestMap.entries()) {
    record.timestamps = record.timestamps.filter((ts) => ts > oneMinuteAgo);
    if (record.timestamps.length === 0) {
      ipRequestMap.delete(key);
    }
  }
}, 60 * 1000);

/**
 * Creates a rate limiter middleware
 */
export function rateLimiter(options: { maxRequests: number; windowMs: number; message?: string }) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
    const routeKey = `${ip}:${req.baseUrl || req.path}`;
    const now = Date.now();
    const windowStart = now - options.windowMs;

    let record = ipRequestMap.get(routeKey);
    if (!record) {
      record = { timestamps: [] };
      ipRequestMap.set(routeKey, record);
    }

    // Keep only timestamps within window
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

    if (record.timestamps.length >= options.maxRequests) {
      res.setHeader('Retry-After', Math.ceil(options.windowMs / 1000));
      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: options.message || 'Too many requests. Please slow down and try again shortly.'
        }
      });
    }

    record.timestamps.push(now);
    res.setHeader('X-RateLimit-Limit', options.maxRequests);
    res.setHeader('X-RateLimit-Remaining', options.maxRequests - record.timestamps.length);
    next();
  };
}

/**
 * Security headers middleware
 */
export function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  next();
}

/**
 * Request body sanitization middleware to prevent malicious HTML/script injections
 */
export function sanitizeInputs(req: Request, _res: Response, next: NextFunction) {
  if (req.body && typeof req.body === 'object') {
    sanitizeObject(req.body);
  }
  next();
}

function sanitizeObject(obj: any) {
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (typeof val === 'string') {
      // Basic sanitization of script tags and inline handlers
      obj[key] = val
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/onerror\s*=/gi, '')
        .replace(/onload\s*=/gi, '');
    } else if (typeof val === 'object' && val !== null) {
      sanitizeObject(val);
    }
  }
}
