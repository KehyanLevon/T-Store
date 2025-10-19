import { useMemo } from "react";

export interface PaginatorProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Paginator({ page, totalPages, onChange }: PaginatorProps) {
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

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const goto = (p: number) => {
    const clamped = Math.max(1, Math.min(totalPages, p));
    if (clamped !== page) onChange(clamped);
  };

  if (totalPages <= 1) return null;

  return (
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
  );
}
