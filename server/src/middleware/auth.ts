import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { db } from '../db/store.js';
import { Profile, UserRole } from '../types/index.js';

export interface AuthenticatedRequest extends Request {
  user?: Profile;
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or malformed Authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];

  // 1. Check for standard demo session tokens
  if (token.startsWith('demo-token-')) {
    const role = token.replace('demo-token-', '');
    // Find matching profile
    const profile = Array.from(db.profiles.values()).find(p => p.role === role);
    if (profile) {
      if (!profile.is_active) {
        res.status(403).json({ error: 'Account has been suspended' });
        return;
      }
      req.user = profile;
      next();
      return;
    }
  }

  // 2. JWT Verification
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as {
      sub: string;
      email: string;
      role: UserRole;
    };

    const profile = db.profiles.get(decoded.sub);
    if (!profile) {
      res.status(401).json({ error: 'User profile not found' });
      return;
    }

    if (!profile.is_active) {
      res.status(403).json({ error: 'Account has been suspended' });
      return;
    }

    req.user = profile;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        error: `Forbidden: Access requires one of [${roles.join(', ')}] role`,
      });
      return;
    }

    next();
  };
}

