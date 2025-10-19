import { Request, Response } from 'express';
import {
  sendForgotPasswordEmail,
  verifyRawResetTokenOrThrow,
  validateResetTokenAgainstUserOrThrow,
  changePasswordWithResetToken,
} from '../services/passwordResetService';
import {
  validateForgotPasswordBody,
  validateVerifyResetTokenBody,
  validateChangePasswordByResetBody,
} from '../utils/validators';

const cookieBase = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/api/auth',
};

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = validateForgotPasswordBody(req.body);
    await sendForgotPasswordEmail(email);
    return res.json({
      message: 'If that email exists, a reset link has been sent.',
    });
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
}

export async function verifyResetToken(req: Request, res: Response) {
  try {
    const { token } = validateVerifyResetTokenBody(req.body);

    const payload = verifyRawResetTokenOrThrow(token);
    await validateResetTokenAgainstUserOrThrow(payload);

    const maxAgeMs =
      Number(process.env.RESET_TOKEN_TTL_MINUTES || 30) * 60 * 1000;
    res.cookie('reset_token', token, { ...cookieBase, maxAge: maxAgeMs });

    return res.json({ message: 'Token accepted' });
  } catch (e: any) {
    if (e?.code === 'EXPIRED' || /expired/i.test(String(e?.message))) {
      return res.status(410).json({ error: 'Token expired' });
    }
    return res.status(400).json({ error: 'Invalid token' });
  }
}

export async function changePassword(req: Request, res: Response) {
  try {
    const { newPassword } = validateChangePasswordByResetBody(req.body);

    const cookieToken = (req as any).cookies?.reset_token as string | undefined;
    if (!cookieToken)
      return res.status(401).json({ error: 'Missing or invalid reset token' });

    const payload = verifyRawResetTokenOrThrow(cookieToken);
    const user = await validateResetTokenAgainstUserOrThrow(payload);

    await changePasswordWithResetToken(user.id, newPassword);

    res.clearCookie('reset_token', cookieBase);

    return res.json({ message: 'Password changed' });
  } catch (e: any) {
    if (e?.code === 'EXPIRED' || /expired/i.test(String(e?.message))) {
      res.clearCookie('reset_token', cookieBase);
      return res.status(410).json({ error: 'Token expired' });
    }
    return res
      .status(/missing|invalid/i.test(String(e?.message)) ? 401 : 400)
      .json({
        error: /token/i.test(String(e?.message))
          ? 'Invalid token'
          : String(e?.message || 'Bad request'),
      });
  }
}
