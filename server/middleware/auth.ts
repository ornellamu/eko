import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';

const JWT_SECRET = process.env.JWT_SECRET || 'eko_luxury_jwt_secret_key_2026_kigali';

export interface AuthTokenPayload {
  id: number;
  email: string;
  role: 'customer' | 'admin';
  name: string;
}

export function generateToken(payload: AuthTokenPayload, expiresIn = '7d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string): AuthTokenPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
  } catch {
    throw new UnauthorizedError('Invalid or expired authentication token');
  }
}

// Extends Express Request to hold authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    // 1. Check Authorization Bearer header
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.eko_token) {
      token = req.cookies.eko_token;
    } else if (req.session && (req.session as any).user) {
      req.user = (req.session as any).user;
      return next();
    }

    if (!token) {
      throw new UnauthorizedError('Authentication token or session required');
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if (!req.user || req.user.role !== 'admin') {
      return next(new ForbiddenError('Administrator access required for this action'));
    }
    next();
  });
}
