import { createEffect, createStore } from "effector";
import { http } from "../../shared/api/http";
import type {
  Product,
  ProductListResponse,
  ProductResponse,
} from "../../shared/api/types";

// ---- Effects
// TODO: How about storing effects separately?
export const createProductFx = createEffect(
  async (body: {
    name: string;
    price: number;
    discountPrice?: number | null;
    description?: string | null;
    photoBase64?: string | null;
    photoMime?: string | null;
  }) => {
    const res = await http.post<ProductResponse, typeof body>(
      "/api/products",
      body
    );
    return res.product;
  }
);

export const getProductsFx = createEffect(
  async (
    params: { q?: string; my?: boolean; page?: number; limit?: number } = {}
  ) => {
    const search = new URLSearchParams();
    if (params.q) search.set("q", params.q);
    if (params.my) search.set("my", "true");
    if (params.page) search.set("page", String(params.page));
    if (params.limit) search.set("limit", String(params.limit));

    const res = await http.get<ProductListResponse>(
      `/api/products${search.toString() ? `?${search}` : ""}`
    );
    return res;
  }
);

export const getProductFx = createEffect(async (id: string) => {
  const res = await http.get<ProductResponse>(`/api/products/${id}`);
  return res.product;
});

export const updateProductFx = createEffect(
  async (args: {
    id: string;
    data: {
      name?: string;
      price?: number;
      discountPrice?: number | null;
      description?: string | null;
      photoBase64?: string | null;
      photoMime?: string | null;
    };
  }) => {
    const res = await http.patch<ProductResponse, (typeof args)["data"]>(
      `/api/products/${args.id}`,
      args.data
    );
    return res.product;
  }
);

// ---- Stores
export const $productsList = createStore<ProductListResponse>({
  items: [],
  total: 0, //TODO: Create and move to constants.ts
  page: 1,
  limit: 12,
  pages: 1,
}).on(getProductsFx.doneData, (_, r) => r);

export const $productDetails = createStore<Product | null>(null)
  .on(getProductFx.doneData, (_, p) => p)
  .on(updateProductFx.doneData, (_, p) => p);
