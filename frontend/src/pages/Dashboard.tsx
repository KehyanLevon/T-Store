import { useEffect, useMemo, useState } from "react";
import { useUnit } from "effector-react";
import { $productsList, getProductsFx } from "../entities/products/model";
import { $user } from "../entities/auth/model";
import { useDebounce } from "../shared/hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "../components/Dashboard/ProductCard";
import { Paginator } from "../components/Dashboard/Paginator";
import { SearchBar } from "../components/Dashboard/SearchBar";
import { MyProductsToggle } from "../components/Dashboard/MyProductsToggle";
import "./Dashboard.css";

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

  const grid = useMemo(
    () =>
      products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          isMine={Boolean(user && user.id === p.userId)}
        />
      )),
    [products, user]
  );

  return (
    <>
      <div className="toolbar">
        <SearchBar value={q} onChange={setQ} />
        <MyProductsToggle
          enabled={myOnly}
          onToggle={() => setMyOnly((v) => !v)}
          visible={Boolean(user)}
        />
      </div>

      <h2 className="section-title">Featured Products</h2>

      {loading && <p style={{ textAlign: "left" }}>Loading…</p>}
      {!loading && products.length === 0 && (
        <p style={{ textAlign: "left" }}>
          {myOnly ? "You have no products yet." : "No products found."}
        </p>
      )}

      <div className="grid">{grid}</div>

      <Paginator page={page} totalPages={totalPages} onChange={setPage} />
    </>
  );
}
