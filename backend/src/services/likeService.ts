import Like from '../models/like';
import Product from '../models/product';

export async function addLike(userId: string, productId: string) {
  const product = await Product.findByPk(productId);
  if (!product) throw new Error('Product not found');

  const [like] = await Like.findOrCreate({
    where: { userId, productId },
    defaults: { userId, productId },
  });

  return { productId: like.productId };
}

export async function removeLike(userId: string, productId: string) {
  const deleted = await Like.destroy({ where: { userId, productId } });
  return { removed: deleted > 0 };
}

export async function listMyLikes(userId: string) {
  const rows = await Like.findAll({
    where: { userId },
    attributes: ['productId'],
    order: [['createdAt', 'DESC']],
  });
  return rows.map((r) => r.productId);
}
