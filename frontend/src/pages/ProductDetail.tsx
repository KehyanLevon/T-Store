import { useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useUnit } from "effector-react";
import { getProductFx, $productDetails } from "../entities/products/model";
import { $user } from "../entities/auth/model";
import { LikeButton } from "../shared/ui/LikeButton";
import "./ProductDetail.css";

function formatPrice(n?: number | null) {
  if (n == null) return "";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);
}

export default function ProductDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();

  const [loadProduct, pending, product, me] = useUnit([
    getProductFx,
    getProductFx.pending,
    $productDetails,
    $user,
  ]);

  useEffect(() => {
    if (id) loadProduct(id).catch(() => {});
  }, [id]);

  const isOwner = useMemo(
    () => !!me?.id && !!product?.userId && me.id === product.userId,
    [me?.id, product?.userId]
  );

  if (pending && !product) {
    return (
      <div className="card pd__loading">
        <div className="pd__skeleton pd__skeleton--img" />
        <div className="pd__skeleton pd__skeleton--text" />
        <div className="pd__skeleton pd__skeleton--text" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="card">
        <p>Product not found.</p>
        <button className="btn btn--muted" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    );
  }

  const imgSrc =
    product.photo && product.photoMime
      ? `data:${product.photoMime};base64,${product.photo}`
      : null;

  return (
    <div className="pd card">
      <div className="pd__grid">
        <div className="pd__media">
          {imgSrc ? (
            <img src={imgSrc} alt={product.name} />
          ) : (
            <div className="pd__placeholder">
              <span className="pd__icon" aria-hidden>
                🖼️
              </span>
              <span className="muted">No photo</span>
            </div>
          )}
        </div>

        <div className="pd__info">
          <nav className="pd__breadcrumbs muted">
            <Link to="/">Home</Link> <span> / </span>
            <Link to="/products">Products</Link> <span> / </span>
            <span>{product.name}</span>
          </nav>

          <h1 className="pd__title">{product.name}</h1>

          <div className="pd__price">
            <span className="pd__price-current">
              {formatPrice(product.discountPrice ?? product.price)}
            </span>
            {product.discountPrice != null && (
              <span className="pd__price-old">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <div className="pd__section">
            <h3 className="pd__section-title">Description</h3>
            <p className="pd__desc">
              {product.description || "No description provided."}
            </p>
          </div>

          <div className="pd__actions">
            <LikeButton productId={product.id} />

            {isOwner && (
              <Link
                to={`/products/${product.id}/edit`}
                className="btn btn--muted"
              >
                Edit Product
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
