import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import {
  createProduct,
  getProduct,
  listProducts,
  updateProduct,
} from '../services/productService';
import { validateCreateProductBody } from '../utils/validators';

export async function create(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!;
    const body = validateCreateProductBody(req.body);
    const product = await createProduct({ userId, ...body });
    res.status(201).json({ product });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}

export async function list(req: AuthRequest, res: Response) {
  try {
    const { q, my, page, limit } = req.query as Record<
      string,
      string | undefined
    >;
    const parsed = await listProducts({
      q: q,
      my: my === 'true' || my === '1',
      userId: req.userId,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
    res.json(parsed);
  } catch (e: any) {
    const code = e.message === 'Auth required for my=true' ? 401 : 400;
    res.status(code).json({ error: e.message });
  }
}

export async function detail(req: Request, res: Response) {
  try {
    const product = await getProduct(req.params.id);
    res.json({ product });
  } catch (e: any) {
    res.status(404).json({ error: e.message });
  }
}

export async function patch(req: AuthRequest, res: Response) {
  try {
    const updated = await updateProduct(req.params.id, req.userId!, req.body);
    res.json({ product: updated });
  } catch (e: any) {
    const code =
      e.message === 'Product not found'
        ? 404
        : e.message === 'Forbidden'
          ? 403
          : 400;
    res.status(code).json({ error: e.message });
  }
}
