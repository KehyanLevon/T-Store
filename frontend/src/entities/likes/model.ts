import { createEffect, createEvent, createStore, sample } from "effector";
import { http } from "../../shared/api/http";
import { $user, loginFx, registerFx, logoutFx } from "../auth/model";
import { getProductsFx } from "../products/model";
import type { User } from "../../shared/api/types";

const LS_KEY = "tstore_likes";

function readLocal(): string[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? (arr.filter(Boolean) as string[]) : [];
  } catch {
    return [];
  }
}
function writeLocal(ids: string[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(Array.from(new Set(ids))));
  } catch {}
}

export const getMyLikesFx = createEffect(async () => {
  const res = await http.get<{ productIds: string[] }>("/api/likes");
  return res.productIds;
});
export const postLikeFx = createEffect(async (productId: string) => {
  await http.post("/api/likes", { productId });
  return productId;
});
export const deleteLikeFx = createEffect(async (productId: string) => {
  await http.delete(`/api/likes/${productId}`);
  return productId;
});

export const likeLocalFx = createEffect(async (productId: string) => {
  const next = new Set(readLocal());
  next.add(productId);
  writeLocal(Array.from(next));
  return productId;
});
export const unlikeLocalFx = createEffect(async (productId: string) => {
  const next = new Set(readLocal());
  next.delete(productId);
  writeLocal(Array.from(next));
  return productId;
});

const setAll = createEvent<string[]>();
const addOne = createEvent<string>();
const removeOne = createEvent<string>();

export const $likedIds = createStore<Set<string>>(new Set())
  .on(setAll, (_, ids) => new Set(ids))
  .on(addOne, (s, id) => {
    const next = new Set(s);
    next.add(id);
    return next;
  })
  .on(removeOne, (s, id) => {
    const next = new Set(s);
    next.delete(id);
    return next;
  });

sample({
  clock: getMyLikesFx.doneData,
  target: setAll,
});

export const loadLikesRequested = createEvent();

sample({
  source: $user,
  clock: loadLikesRequested,
  filter: (user: User | null) => !!user,
  target: getMyLikesFx,
});

sample({
  source: $user,
  clock: loadLikesRequested,
  filter: (user: User | null) => !user,
  fn: () => readLocal(),
  target: setAll,
});

export const likeClicked = createEvent<string>();
export const unlikeClicked = createEvent<string>();

sample({
  source: $user,
  clock: likeClicked,
  filter: (user: User | null) => !!user,
  fn: (_user, productId) => productId,
  target: postLikeFx,
});
sample({
  source: $user,
  clock: unlikeClicked,
  filter: (user: User | null) => !!user,
  fn: (_user, productId) => productId,
  target: deleteLikeFx,
});

sample({
  source: $user,
  clock: likeClicked,
  filter: (user: User | null) => !user,
  fn: (_user, productId) => productId,
  target: likeLocalFx,
});
sample({
  source: $user,
  clock: unlikeClicked,
  filter: (user: User | null) => !user,
  fn: (_user, productId) => productId,
  target: unlikeLocalFx,
});

export const syncAfterLoginFx = createEffect(async () => {
  const local = readLocal();
  const server = await http.get<{ productIds: string[] }>("/api/likes");
  const serverSet = new Set(server.productIds);
  const toAdd = local.filter((id) => !serverSet.has(id));
  for (const id of toAdd) {
    try {
      await http.post("/api/likes", { productId: id });
    } catch {}
  }
  const final = await http.get<{ productIds: string[] }>("/api/likes");
  writeLocal([]);
  return final.productIds;
});

sample({
  clock: [loginFx.doneData, registerFx.doneData],
  target: syncAfterLoginFx,
});
sample({
  clock: syncAfterLoginFx.doneData,
  target: setAll,
});

sample({
  clock: logoutFx.done,
  target: loadLikesRequested,
});

sample({
  source: $user,
  clock: getProductsFx.doneData,
  filter: (user: User | null) => !!user,
  fn: (_user, resp) => resp.items.filter((p) => p.likedByMe).map((p) => p.id),
  target: setAll,
});

sample({
  clock: likeClicked,
  target: addOne,
});
sample({
  clock: unlikeClicked,
  target: removeOne,
});

sample({
  clock: postLikeFx.fail,
  fn: ({ params }) => params,
  target: removeOne,
});

sample({
  clock: deleteLikeFx.fail,
  fn: ({ params }) => params,
  target: addOne,
});
