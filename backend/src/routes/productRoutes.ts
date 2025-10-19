import { Router } from 'express';
import { authMiddleware, tryAuthMiddleware } from '../middlewares/auth';
import { create, detail, list, patch } from '../controllers/productController';

const router = Router();

router.get('/', tryAuthMiddleware, list);
router.get('/:id', detail);
router.post('/', authMiddleware, create);
router.patch('/:id', authMiddleware, patch);

export default router;
