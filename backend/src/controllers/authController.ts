import { Request, Response } from 'express';
import { getUserById, loginUser, registerUser } from '../services/authService';
import { AuthRequest } from '../middlewares/auth';
import { validateAndBuildRegisterPayload } from '../utils/validators';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function register(req: Request, res: Response) {
  try {
    const payload = validateAndBuildRegisterPayload(req.body);

    const { token, user } = await registerUser(payload);
    res.cookie('token', token, cookieOptions).status(201).json({ user });
  } catch (e: any) {
    const message: string = e?.message || 'Registration failed';
    const status = /already in use/i.test(message) ? 409 : 400;
    res.status(status).json({ error: message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { token, user } = await loginUser(req.body);
    res.cookie('token', token, cookieOptions).json({ user });
  } catch (e: any) {
    res.status(401).json({ error: e.message });
  }
}

export function logout(_req: Request, res: Response) {
  res.clearCookie('token').json({ message: 'Logged out' });
}

export async function me(req: AuthRequest, res: Response) {
  try {
    const user = await getUserById(req.userId!);
    res.json({ user });
  } catch (e: any) {
    res.status(404).json({ error: e.message });
  }
}
