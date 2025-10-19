import { Op, WhereOptions } from 'sequelize';
import Product from '../models/product';
import Like from '../models/like';

export type CreateParams = {
  userId: string;
  name: string;
  price: number;
  discountPrice?: number | null;
  description?: string | null;
  photoBase64?: string | null;
  photoMime?: string | null;
};

export async function createProduct(params: CreateParams) {
  const photo = params.photoBase64
    ? Buffer.from(params.photoBase64, 'base64')
    : null;

  const product = await Product.create({
    userId: params.userId,
    name: params.name,
    price: params.price,
    discountPrice: params.discountPrice ?? null,
    description: params.description ?? null,
    photo,
    photoMime: params.photoMime ?? null,
  });

  return toSafe(product);
}

export async function listProducts(opts: {
  q?: string;
  my?: boolean;
  userId?: string;
  limit?: number;
  page?: number;
}) {
  const where: WhereOptions = {};

  if (opts.q && opts.q.trim()) {
    const q = `%${opts.q.trim()}%`;
    Object.assign(where, {
      [Op.or]: [
        { name: { [Op.iLike]: q } },
        { description: { [Op.iLike]: q } },
      ],
    });
  }

  if (opts.my) {
    if (!opts.userId) throw new Error('Auth required for my=true');
    Object.assign(where, { userId: opts.userId });
  }

  const limit = Math.min(Math.max(opts.limit ?? 20, 1), 100);
  const page = Math.max(opts.page ?? 1, 1);
  const offset = (page - 1) * limit;

  const { rows, count } = await Product.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  let likedIds = new Set<string>();
  if (opts.userId) {
    const ids = rows.map((p) => p.id);
    const likes = await Like.findAll({
      where: { userId: opts.userId, productId: ids },
      attributes: ['productId'],
    });
    likedIds = new Set(likes.map((l) => l.productId));
  }

  return {
    items: rows.map((p) => ({ ...toSafe(p), likedByMe: likedIds.has(p.id) })),
    total: count,
    page,
    limit,
    pages: Math.ceil(count / limit),
  };
}

export async function getProduct(id: string, userId?: string) {
  const product = await Product.findByPk(id);
  if (!product) throw new Error('Product not found');

  let likedByMe = false;
  if (userId) {
    const like = await Like.findOne({ where: { userId, productId: id } });
    likedByMe = !!like;
  }

  return { ...toSafe(product), likedByMe };
}

export async function updateProduct(
  id: string,
  userId: string,
  data: Partial<CreateParams>,
) {
  const product = await Product.findByPk(id);
  if (!product) throw new Error('Product not found');
  if (product.userId !== userId) throw new Error('Forbidden');

  if (typeof data.name === 'string') product.name = data.name;
  if (typeof data.price === 'number') product.price = data.price;
  if (data.discountPrice !== undefined)
    product.discountPrice = data.discountPrice ?? null;
  if (data.description !== undefined)
    product.description = data.description ?? null;

  if (data.photoBase64 !== undefined) {
    product.photo = data.photoBase64
      ? Buffer.from(data.photoBase64, 'base64')
      : null;
  }
  if (data.photoMime !== undefined) {
    product.photoMime = data.photoMime ?? null;
  }

  await product.save();
  return toSafe(product);
}

function toSafe(p: Product) {
  const photoBuf = p.photo as Buffer | null | undefined;
  return {
    id: p.id,
    userId: p.userId,
    name: p.name,
    price: Number(p.price),
    discountPrice: p.discountPrice != null ? Number(p.discountPrice) : null,
    description: p.description ?? null,
    photo: photoBuf ? photoBuf.toString('base64') : null,
    photoMime: p.photoMime ?? null,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}
