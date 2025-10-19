import bcrypt from 'bcrypt';
import jwt, { Secret, TokenExpiredError } from 'jsonwebtoken';
import User from '../models/user';
import { sha256Hex } from '../utils/crypto';
import { transporter } from '../utils/email';

const RESET_JWT_SECRET: Secret = (process.env.RESET_JWT_SECRET ||
  process.env.JWT_SECRET)!;
const RESET_TOKEN_TTL_MINUTES = Number(
  process.env.RESET_TOKEN_TTL_MINUTES || 30,
);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const mail = process.env.SMTP_USER;
type ResetPayload = {
  sub: string;
  typ: 'pwd_reset';
  prv: string;
  iat?: number;
  exp?: number;
};

export async function sendForgotPasswordEmail(email: string) {
  const user = await User.findOne({ where: { email } });

  if (!user) return;

  const payload: ResetPayload = {
    sub: user.id,
    typ: 'pwd_reset',
    prv: sha256Hex(user.passwordHash),
  };

  const token = jwt.sign(payload, RESET_JWT_SECRET, {
    expiresIn: `${RESET_TOKEN_TTL_MINUTES}m`,
  });
  const resetLink = `${FRONTEND_URL}/reset-password?token=${encodeURIComponent(token)}`;

  await transporter.sendMail({
    from: mail,
    to: user.email,
    subject: 'Password reset',
    html: `Hi ${user.firstName},\n\nUse this link to reset your password:\n${resetLink}\n\nThis link expires in ${RESET_TOKEN_TTL_MINUTES} minutes.`,
  });
}

export function verifyRawResetTokenOrThrow(rawToken: string): ResetPayload {
  try {
    const decoded = jwt.verify(rawToken, RESET_JWT_SECRET) as ResetPayload;
    if (decoded?.typ !== 'pwd_reset' || !decoded?.sub || !decoded?.prv) {
      throw new Error('Invalid token');
    }
    return decoded;
  } catch (e: any) {
    if (e instanceof TokenExpiredError) {
      const err: any = new Error('Token expired');
      err.code = 'EXPIRED';
      throw err;
    }
    throw new Error('Invalid token');
  }
}

export async function validateResetTokenAgainstUserOrThrow(
  payload: ResetPayload,
) {
  const user = await User.findByPk(payload.sub);
  if (!user) throw new Error('Invalid token');

  const currentPrv = sha256Hex(user.passwordHash);
  if (currentPrv !== payload.prv) {
    throw new Error('Invalid token');
  }
  return user;
}

export async function changePasswordWithResetToken(
  userId: string,
  newPassword: string,
) {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();
}
