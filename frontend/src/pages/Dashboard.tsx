import { useEffect, useMemo, useState } from "react";
import { useUnit } from "effector-react";
import { $productsList, getProductsFx } from "../entities/products/model";
import { $user } from "../entities/auth/model";
import { useDebounce } from "../shared/hooks/useDebounce";
import { Link, useSearchParams } from "react-router-dom";
import { LikeButton } from "../shared/ui/LikeButton";
import "./Dashboard.css";

// TODO: Component is too huge
export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQ = searchParams.get("q") ?? "";
  const initialMy = searchParams.get("my") === "true";
  const initialPage = Math.max(
    parseInt(searchParams.get("page") || "1", 10) || 1,
    1
  );

  const [q, setQ] = useState(initialQ);
  const [myOnly, setMyOnly] = useState(initialMy);
  const [page, setPage] = useState(initialPage);

  const debouncedQ = useDebounce(q, 400);

  const [list, loading, user] = useUnit([
    $productsList,
    getProductsFx.pending,
    $user,
  ]);
  const products = list.items;

  useEffect(() => {
    getProductsFx({
      q: debouncedQ || undefined,
      my: myOnly || undefined,
      page,
      limit: list.limit || 12,
    });
  }, [debouncedQ, myOnly, page]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQ, myOnly]);

  useEffect(() => {
    const next = new URLSearchParams();
    if (debouncedQ) next.set("q", debouncedQ);
    if (myOnly) next.set("my", "true");
    if (page > 1) next.set("page", String(page));
    setSearchParams(next, { replace: true });
  }, [debouncedQ, myOnly, page, setSearchParams]);

  const totalPages = Math.max(list.pages || 1, 1);
  const canPrev = page > 1;
  const canNext = page < totalPages;

  function goto(p: number) {
    const clamped = Math.max(1, Math.min(totalPages, p));
    if (clamped !== page) setPage(clamped);
  }

  const pageNumbers = useMemo(() => {
    const windowSize = 5;
    const half = Math.floor(windowSize / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + windowSize - 1);
    if (end - start + 1 < windowSize) {
      start = Math.max(1, end - windowSize + 1);
    }
    const arr: number[] = [];
    for (let p = start; p <= end; p++) arr.push(p);
    return arr;
  }, [page, totalPages]);

  return (
    <>
      <div className="toolbar">
        <div className="search">
          <label className="search__label">
            <svg
              className="search__icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
              />
            </svg>

            <input
              className="search__input"
              placeholder="Search for products"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ border: "1px solid #f6f7f8" }}
            />
          </label>
        </div>

        {user ? (
          <div className="toggle-wrap">
            <span className="toggle-label">My Products</span>
            <button
              className="switch"
              role="switch"
              aria-checked={myOnly}
              id="my-products"
              onClick={() => setMyOnly((v) => !v)}
              title={
                myOnly ? "Showing only your products" : "Show only my products"
              }
            >
              <span className="switch__thumb"></span>
            </button>
          </div>
        ) : null}
      </div>

      <h2 className="section-title">Featured Products</h2>

      {loading && <p style={{ textAlign: "left" }}>Loading…</p>}
      {!loading && products.length === 0 && (
        <p style={{ textAlign: "left" }}>
          {myOnly ? "You have no products yet." : "No products found."}
        </p>
      )}

      <div className="grid">
        {products.map((p) => {
          const mine = user?.id === p.userId;

          const hasSale =
            p.discountPrice != null &&
            Number.isFinite(p.discountPrice) &&
            Number(p.discountPrice) < Number(p.price);

          const imgSrc =
            p.photo && p.photoMime
              ? `data:${p.photoMime};base64,${p.photo}`
              : undefined;

          {
            /* TODO: How about to create and move to components/Dashboard/ProductCard.tsx ? */
          }
          return (
            <Link
              to={`/products/${p.id}`}
              className="product_card__link"
              aria-label={`Open product ${p.name}`}
              key={p.id}
            >
              <article
                className={`product_card${mine ? " product_card--mine" : ""}`}
                title={mine ? "This product belongs to you" : undefined}
              >
                <div
                  style={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}
                >
                  <LikeButton productId={p.id} />
                </div>
                {mine && <div className="badge">MINE</div>}

                <div
                  className={`product_card__media${
                    mine ? " product_card__media--mine" : ""
                  }`}
                >
                  {imgSrc ? (
                    <img
                      className="product_card__img"
                      alt={p.name}
                      src={imgSrc}
                    />
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
                    mine ? " product_card__body--p" : ""
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
                    <p className="product_card__price">
                      ${Number(p.price).toFixed(2)}
                    </p>
                  )}
                </div>
              </article>
            </Link>
          );
        })}
      </div>

      {/* TODO: How about to create and move to components/Dashboard/Paginator.tsx ? */}
      {totalPages > 1 && (
        <nav
          className="pagination"
          aria-label="Pagination"
          style={{ marginTop: 16 }}
        >
          <button
            className="btn btn--muted"
            disabled={!canPrev}
            onClick={() => goto(page - 1)}
          >
            Prev
          </button>
          {pageNumbers.map((p) => (
            <button
              key={p}
              className={`btn ${p === page ? "btn--primary" : "btn--muted"}`}
              style={{ marginLeft: "0.5rem" }}
              onClick={() => goto(p)}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          ))}
          <button
            className="btn btn--muted"
            style={{ marginLeft: "0.5rem" }}
            disabled={!canNext}
            onClick={() => goto(page + 1)}
          >
            Next
          </button>
        </nav>
      )}
    </>
  );
}
