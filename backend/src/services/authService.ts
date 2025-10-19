import bcrypt from 'bcrypt';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import User from '../models/user';

const JWT_SECRET: Secret = process.env.JWT_SECRET as Secret;
const JWT_EXPIRES_IN: SignOptions['expiresIn'] = process.env
  .JWT_EXPIRES_IN as SignOptions['expiresIn'];

export async function registerUser(params: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate?: string;
  photoBase64?: string;
  photoMime?: string;
}) {
  const existing = await User.findOne({ where: { email: params.email } });
  if (existing) throw new Error('Email already in use');

  const passwordHash = await bcrypt.hash(params.password, 10);

  let photo: Buffer | null = null;
  if (params.photoBase64) {
    photo = Buffer.from(params.photoBase64, 'base64');
  }

  const user = await User.create({
    firstName: params.firstName,
    lastName: params.lastName,
    email: params.email,
    passwordHash,
    birthDate: params.birthDate ? new Date(params.birthDate) : null,
    photo,
    photoMime: params.photoMime ?? null,
  });

  const token = jwt.sign({ sub: user.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
  return { token, user: safeUser(user) };
}

export async function loginUser(params: { email: string; password: string }) {
  const user = await User.findOne({ where: { email: params.email } });
  if (!user) throw new Error('Invalid credentials');

  const ok = await bcrypt.compare(params.password, user.passwordHash);
  if (!ok) throw new Error('Invalid credentials');

  const token = jwt.sign({ sub: user.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
  return { token, user: safeUser(user) };
}

export async function getMe(userId: string) {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');
  return safeUser(user);
}

export function safeUser(u: User) {
  const { id, firstName, lastName, email, birthDate, createdAt, updatedAt } = u;
  const photoBuf = u.photo as Buffer | null | undefined;
  const photoBase64 = photoBuf ? photoBuf.toString('base64') : null;

  return {
    id,
    firstName,
    lastName,
    email,
    birthDate,
    createdAt,
    updatedAt,
    photo: photoBase64,
    photoMime: u.photoMime ?? null,
  };
}
