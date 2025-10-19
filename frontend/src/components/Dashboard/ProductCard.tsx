import { Link } from "react-router-dom";
import { LikeButton } from "../../shared/ui/LikeButton";

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number | string;
    discountPrice?: number | string | null;
    userId?: string;
    photo?: string | null;
    photoMime?: string | null;
  };
  isMine: boolean;
}

export function ProductCard({ product: p, isMine }: ProductCardProps) {
  const hasSale =
    p.discountPrice != null &&
    Number.isFinite(Number(p.discountPrice)) &&
    Number(p.discountPrice) < Number(p.price);

  const imgSrc =
    p.photo && p.photoMime
      ? `data:${p.photoMime};base64,${p.photo}`
      : undefined;

  return (
    <Link
      to={`/products/${p.id}`}
      className="product_card__link"
      aria-label={`Open product ${p.name}`}
    >
      <article
        className={`product_card${isMine ? " product_card--mine" : ""}`}
        title={isMine ? "This product belongs to you" : undefined}
      >
        <div style={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}>
          <LikeButton productId={p.id} />
        </div>

        {isMine && <div className="badge">MINE</div>}

        <div
          className={`product_card__media${
            isMine ? " product_card__media--mine" : ""
          }`}
        >
          {imgSrc ? (
            <img className="product_card__img" alt={p.name} src={imgSrc} />
          ) : (
            <div
              className="product_card__img"
              style={{
                display: "grid",
                placeItems: "center",
                background: "var(--slate-200)",
                color: "var(--slate-600)",
                fontSize: ".75rem",
                fontWeight: 600,
              }}
            >
              No image
            </div>
          )}
        </div>

        <div
          className={`product_card__body${
            isMine ? " product_card__body--p" : ""
          }`}
        >
          <h3 className="product_card__title">{p.name}</h3>

          {hasSale ? (
            <div>
              <p className="product_card__price product_card__price--sale">
                ${Number(p.discountPrice).toFixed(2)}
              </p>
              <p className="product_card__price-compare">
                ${Number(p.price).toFixed(2)}
              </p>
            </div>
          ) : (
            <p className="product_card__price">${Number(p.price).toFixed(2)}</p>
          )}
        </div>
      </article>
    </Link>
  );
}
