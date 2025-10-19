import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import * as likeController from '../controllers/likeController';

const router = Router();

router.get('/', authMiddleware, likeController.list);
router.post('/', authMiddleware, likeController.create);
router.delete('/:productId', authMiddleware, likeController.destroy);

export default router;
