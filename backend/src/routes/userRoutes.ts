import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import { updateMe } from '../controllers/userController';

const router = Router();

router.patch('/me', authMiddleware, updateMe);

export default router;
