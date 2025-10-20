import type { CreateParams } from '../services/productService';
import {
  PRODUCT_PHOTO_MAX_SIZE_MB,
  PROFILE_PHOTO_MAX_SIZE_MB,
} from './constants';

export function validateAndBuildRegisterPayload(body: any) {
  const errors: string[] = [];

  const pickStr = (v: any) => (typeof v === 'string' ? v.trim() : '');
  const firstName = pickStr(body?.firstName);
  const lastName = pickStr(body?.lastName);
  const email = pickStr(body?.email).toLowerCase();
  const password = pickStr(body?.password);

  if (!firstName) errors.push('First name is required');
  if (!lastName) errors.push('Last name is required');

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  if (!email) errors.push('Email is required');
  else if (!emailRe.test(email)) errors.push('Email is invalid');

  if (!password) errors.push('Password is required');
  else if (password.length < 6)
    errors.push('Password must be at least 6 characters');

  let birthDate: string | undefined = undefined;
  if (body?.birthDate) {
    const d = new Date(String(body.birthDate));
    if (Number.isNaN(d.getTime())) {
      errors.push('birthDate must be a valid date (YYYY-MM-DD)');
    } else {
      birthDate = d.toISOString().slice(0, 10);
    }
  }

  let photoBase64: string | undefined = undefined;
  let photoMime: string | undefined = undefined;

  if (body?.photoBase64) {
    const b64 = String(body.photoBase64).trim();
    const b64Re = /^[A-Za-z0-9+/=\s]+$/;
    if (!b64Re.test(b64)) {
      errors.push('photoBase64 must be a valid base64 string');
    } else {
      photoBase64 = b64.replace(/\s+/g, '');
      try {
        Buffer.from(photoBase64, 'base64');
      } catch {
        errors.push('photoBase64 is not decodable');
      }
    }
  }

  if (body?.photoMime) {
    const mime = String(body.photoMime).trim().toLowerCase();
    if (!mime.startsWith('image/')) {
      errors.push("photoMime must start with 'image/'");
    } else {
      photoMime = mime;
    }
  }

  if (errors.length) {
    const err = new Error(errors[0]);
    (err as any).details = errors;
    throw err;
  }

  return {
    firstName,
    lastName,
    email,
    password,
    birthDate,
    photoBase64,
    photoMime,
  };
}

export function validateCreateProductBody(
  raw: unknown,
): Omit<CreateParams, 'userId'> {
  const body = (raw ?? {}) as Record<string, unknown>;
  const errors: string[] = [];

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (!name) errors.push('Name is required');

  const priceNum = Number(body.price);
  if (!Number.isFinite(priceNum))
    errors.push('Price is required and must be a number');
  else if (priceNum <= 0) errors.push('Price must be greater than 0');

  let discountPrice: number | null = null;
  if (body.discountPrice !== undefined && body.discountPrice !== null) {
    const dp = Number(body.discountPrice);
    if (!Number.isFinite(dp) || dp < 0) {
      errors.push('Discount price must be a non-negative number');
    } else {
      discountPrice = dp;
    }
  }

  const description =
    typeof body.description === 'string' ? body.description : null;

  const photoBase64 =
    typeof body.photoBase64 === 'string' ? body.photoBase64.trim() : null;

  let photoMime: string | null = null;
  if (body.photoMime !== undefined && body.photoMime !== null) {
    const mime = String(body.photoMime).trim().toLowerCase();
    if (!mime.startsWith('image/')) {
      errors.push('photoMime must start with "image/"');
    } else {
      photoMime = mime;
    }
  }
  if (photoBase64) {
    try {
      const buffer = Buffer.from(photoBase64, 'base64');
      const MAX_SIZE_BYTES = PRODUCT_PHOTO_MAX_SIZE_MB * 1024 * 1024;
      if (buffer.byteLength > MAX_SIZE_BYTES) {
        errors.push('Photo is too large (max 10MB)');
      }
    } catch {
      errors.push('photoBase64 is not a valid base64 string');
    }
  }

  if (errors.length) {
    const err = new Error(errors[0]);
    (err as any).details = errors;
    throw err;
  }

  return {
    name,
    price: priceNum,
    discountPrice,
    description,
    photoBase64,
    photoMime,
  };
}

export function validateForgotPasswordBody(body: any): { email: string } {
  const email = String(body?.email || '').trim();
  if (!email) throw new Error('Email is required');
  return { email };
}

export function validateVerifyResetTokenBody(body: any): { token: string } {
  const token = String(body?.token || '').trim();
  if (!token) throw new Error('Token is required');
  return { token };
}

export function validateChangePasswordByResetBody(body: any): {
  newPassword: string;
} {
  const newPassword = String(body?.newPassword || '');
  if (newPassword.length < 6)
    throw new Error('Password must be at least 6 characters');
  return { newPassword };
}

export function validateUpdateMeBody(body: any): {
  firstName: string;
  lastName: string;
  birthDate?: string;
  photoBase64?: string;
  photoMime?: string;
  removePhoto: boolean;
} {
  const errors: string[] = [];

  const pickStr = (v: any) => (typeof v === 'string' ? v.trim() : '');

  const firstName = pickStr(body?.firstName);
  const lastName = pickStr(body?.lastName);

  if (!firstName) errors.push('First name is required');
  if (!lastName) errors.push('Last name is required');

  let birthDate: string | undefined = undefined;
  if (body?.birthDate !== undefined && body?.birthDate !== null) {
    const d = new Date(String(body.birthDate));
    if (Number.isNaN(d.getTime())) {
      errors.push('birthDate must be a valid date (YYYY-MM-DD)');
    } else {
      birthDate = d.toISOString().slice(0, 10);
    }
  }

  const removePhoto = Boolean(body?.removePhoto);

  let photoBase64: string | undefined = undefined;
  let photoMime: string | undefined = undefined;

  if (body?.photoBase64 !== undefined && body?.photoBase64 !== null) {
    const b64 = String(body.photoBase64).trim();
    const b64Re = /^[A-Za-z0-9+/=\s]+$/;
    if (!b64) {
      errors.push('photoBase64 cannot be empty when provided');
    } else if (!b64Re.test(b64)) {
      errors.push('photoBase64 must be a valid base64 string');
    } else {
      const compact = b64.replace(/\s+/g, '');
      try {
        const buf = Buffer.from(compact, 'base64');
        const MAX_BYTES = PROFILE_PHOTO_MAX_SIZE_MB * 1024 * 1024;
        if (buf.byteLength > MAX_BYTES) {
          errors.push('Photo is too large');
        } else {
          photoBase64 = compact;
        }
      } catch {
        errors.push('photoBase64 is not decodable');
      }
    }
  }

  if (body?.photoMime !== undefined && body?.photoMime !== null) {
    const mime = String(body.photoMime).trim().toLowerCase();
    if (!mime.startsWith('image/')) {
      errors.push("photoMime must start with 'image/'");
    } else {
      photoMime = mime;
    }
  }

  if (removePhoto && photoBase64) {
    errors.push('Cannot provide both removePhoto and photoBase64');
  }

  if (errors.length) {
    const err = new Error(errors[0]);
    (err as any).details = errors;
    throw err;
  }

  return {
    firstName,
    lastName,
    birthDate,
    photoBase64,
    photoMime,
    removePhoto,
  };
}

export function validateChangeMyPasswordBody(body: any): {
  newPassword: string;
} {
  const errors: string[] = [];
  const pickStr = (v: any) => (typeof v === 'string' ? v.trim() : '');

  const newPassword = pickStr(body?.newPassword);

  if (!newPassword) errors.push('New password is required');
  else if (newPassword.length < 6)
    errors.push('New password must be at least 6 characters');

  if (errors.length) {
    const err = new Error(errors[0]);
    (err as any).details = errors;
    throw err;
  }

  return { newPassword };
}
