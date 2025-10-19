import { Request, Response } from 'express';
import User from '../models/user';
import { AuthRequest } from '../middlewares/auth';

function toSafeUserWithPhoto(u: User) {
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

export async function updateMe(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const {
      firstName,
      lastName,
      birthDate,
      photoBase64,
      photoMime,
      removePhoto,
    } = req.body as {
      firstName?: string;
      lastName?: string;
      birthDate?: string;
      photoBase64?: string;
      photoMime?: string;
      removePhoto?: boolean;
    };

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (typeof firstName === 'string') user.firstName = firstName.trim();
    if (typeof lastName === 'string') user.lastName = lastName.trim();

    if (typeof birthDate === 'string') {
      user.birthDate = birthDate ? (birthDate as unknown as Date) : null;
    }

    if (removePhoto) {
      user.photo = null;
      user.photoMime = null;
    } else if (photoBase64) {
      const MAX_BYTES = 5 * 1024 * 1024;
      const buf = Buffer.from(photoBase64, 'base64');
      if (buf.byteLength > MAX_BYTES) {
        return res.status(400).json({ error: 'Photo is too large' });
      }
      user.photo = buf;
      user.photoMime = photoMime ?? 'application/octet-stream';
    }
    await user.save();

    return res.json({ user: toSafeUserWithPhoto(user) });
  } catch (e: any) {
    console.error('[updateMe] error:', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
