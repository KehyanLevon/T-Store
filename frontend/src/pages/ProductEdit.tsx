import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUnit } from "effector-react";
import { $user } from "../entities/auth/model";
import {
  $productDetails,
  getProductFx,
  updateProductFx,
} from "../entities/products/model";
import { ProductForm, type ProductFormSubmit } from "../components/ProductForm";

export default function ProductEdit() {
  const { id = "" } = useParams();
  const navigate = useNavigate();

  const [me, product, load, loading, update, updating] = useUnit([
    $user,
    $productDetails,
    getProductFx,
    getProductFx.pending,
    updateProductFx,
    updateProductFx.pending,
  ]);

  useEffect(() => {
    if (id) load(id).catch(() => {});
  }, [id]);

  const isOwner = useMemo(
    () => !!me?.id && !!product?.userId && me.id === product.userId,
    [me?.id, product?.userId]
  );

  if (!product && loading) {
    return (
      <div className="card">
        <p>Loading…</p>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="card">
        <p>Product not found.</p>
      </div>
    );
  }
  if (!isOwner) {
    return (
      <div className="card">
        <p>You are not allowed to edit this product.</p>
      </div>
    );
  }

  async function handleSubmit(data: ProductFormSubmit) {
    await update({
      id,
      data: {
        name: data.name,
        price: data.price,
        discountPrice: data.discountPrice,
        description: data.description,
        photoBase64: data.photoBase64,
        photoMime: data.photoMime,
      },
    });
    navigate(`/products/${id}`);
  }

  return (
    <div className="card create-product">
      <h1 className="cp__title">Edit product</h1>
      <ProductForm
        mode="edit"
        initialValues={{
          name: product.name,
          price: String(product.price),
          discountPrice:
            product.discountPrice != null ? String(product.discountPrice) : "",
          description: product.description || "",
          existingPhotoBase64: product.photo,
          existingPhotoMime: product.photoMime,
        }}
        pending={updating}
        onCancel={() => navigate(-1)} // TODO: not the best solution(but not critical)
        onSubmit={handleSubmit}
      />
    </div>
  );
}
