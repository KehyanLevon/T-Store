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

const SALT_ROUNDS = Number.isFinite(Number(process.env.PASSWORD_SALT))
  ? Number(process.env.PASSWORD_SALT)
  : 10;

const mailFrom = process.env.SMTP_USER;

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
    from: mailFrom,
    to: user.email,
    subject: 'Password reset',
    text: `Hi ${user.firstName},

Use this link to reset your password:
${resetLink}

This link expires in ${RESET_TOKEN_TTL_MINUTES} minutes.`,
    html: `<p>Hi ${escapeHtml(user.firstName)},</p>
<p>Use this link to reset your password:</p>
<p><a href="${resetLink}">${resetLink}</a></p>
<p>This link expires in ${RESET_TOKEN_TTL_MINUTES} minutes.</p>`,
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

  const sameAsOld = await bcrypt.compare(newPassword, user.passwordHash);
  if (sameAsOld) {
    throw new Error('New password must be different from current password');
  }

  const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
  user.passwordHash = hashed;
  await user.save();
}

function escapeHtml(s: string) {
  return String(s).replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return ch;
    }
  });
}
