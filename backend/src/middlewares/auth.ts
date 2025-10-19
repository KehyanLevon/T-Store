import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export interface AuthRequest extends Request {
  userId?: string;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;
  const cookieToken = req.cookies?.token;

  const token = header?.startsWith('Bearer ')
    ? header.slice('Bearer '.length)
    : cookieToken;

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string };
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function tryAuthMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const header = req.headers.authorization;
    const cookieToken = (req as any).cookies?.token;
    const token = header?.startsWith('Bearer ')
      ? header.slice('Bearer '.length)
      : cookieToken;

    if (token) {
      const payload = jwt.verify(token, JWT_SECRET) as { sub: string };
      req.userId = payload.sub;
    }
  } catch {
  } finally {
    next();
  }
}
