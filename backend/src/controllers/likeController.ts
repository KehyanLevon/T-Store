import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { addLike, removeLike, listMyLikes } from '../services/likeService';

export async function create(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) return res.status(401).json({ error: 'Unauthorized' });
    const { productId } = req.body as { productId: string };
    if (!productId)
      return res.status(400).json({ error: 'productId is required' });

    const result = await addLike(req.userId, productId);
    return res.status(201).json(result);
  } catch (e: any) {
    const code = e.message === 'Product not found' ? 404 : 400;
    return res.status(code).json({ error: e.message });
  }
}

export async function destroy(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) return res.status(401).json({ error: 'Unauthorized' });
    const { productId } = req.params;
    if (!productId)
      return res.status(400).json({ error: 'productId is required' });

    const result = await removeLike(req.userId, productId);
    return res
      .status(result.removed ? 204 : 200)
      .json(result.removed ? undefined : { removed: false });
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
}

export async function list(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) return res.status(401).json({ error: 'Unauthorized' });
    const ids = await listMyLikes(req.userId);
    return res.json({ productIds: ids });
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
}
