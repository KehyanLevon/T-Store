import { Router } from 'express';
import { register, login, me, logout } from '../controllers/authController';
import { authMiddleware } from '../middlewares/auth';
import {
  verifyResetToken,
  forgotPassword,
  changePassword,
} from '../controllers/passwordResetController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authMiddleware, me);

router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-token', verifyResetToken);
router.post('/change-password', changePassword);

export default router;
