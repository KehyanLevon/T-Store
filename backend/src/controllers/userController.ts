import { Request, Response } from 'express';
import User from '../models/user';
import { AuthRequest } from '../middlewares/auth';
import { validateUpdateMeBody } from '../utils/validators';

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
    } = validateUpdateMeBody(req.body);

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.firstName = firstName;
    user.lastName = lastName;

    if (birthDate !== undefined) {
      user.birthDate = birthDate ? (birthDate as unknown as Date) : null;
    }

    if (removePhoto) {
      user.photo = null;
      user.photoMime = null;
    } else if (photoBase64) {
      user.photo = Buffer.from(photoBase64, 'base64');
      user.photoMime = photoMime ?? 'application/octet-stream';
    }

    await user.save();

    return res.json({ user: toSafeUserWithPhoto(user) });
  } catch (e: any) {
    if (e?.details || /required|invalid|must/i.test(String(e?.message))) {
      return res.status(400).json({ error: e.message, details: e.details });
    }
    console.error('[updateMe] error:', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
