import { createStore, createEffect, createEvent } from "effector";
import { http } from "../../shared/api/http";
import type { AuthResponse, User } from "../../shared/api/types";
import { sample } from "effector";

export const loginFx = createEffect(
  async (body: { email: string; password: string }) => {
    const res = await http.post<AuthResponse, typeof body>(
      "/api/auth/login",
      body
    );
    return res.user;
  }
);

export const registerFx = createEffect(
  async (body: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    birthDate?: string;
    photoBase64?: string;
    photoMime?: string;
  }) => {
    const res = await http.post<AuthResponse, typeof body>(
      "/api/auth/register",
      body
    );
    return res.user;
  }
);

export const updateProfileFx = createEffect(
  async (body: {
    firstName: string;
    lastName: string;
    birthDate?: string;
    photoBase64?: string;
    photoMime?: string;
    removePhoto?: boolean;
  }) => {
    const res = await http.patch<AuthResponse, typeof body>(
      "/api/users/me",
      body
    );
    return res.user;
  }
);

export const fetchMeFx = createEffect(async () => {
  const res = await http.get<AuthResponse>("/api/auth/me");
  return res.user;
});

export const $isAuthChecked = createStore(false).on(
  fetchMeFx.finally,
  () => true
);

export const logoutFx = createEffect(async () => {
  await http.post("/api/auth/logout", {});
});

export const logoutClicked = createEvent();

export const $user = createStore<User | null>(null)
  .on(loginFx.doneData, (_, user) => user)
  .on(registerFx.doneData, (_, user) => user)
  .on(fetchMeFx.doneData, (_, user) => user)
  .on(updateProfileFx.doneData, (_, user) => user)
  .reset([logoutFx.done, logoutClicked]);

export const $isAuth = $user.map(Boolean);

sample({
  clock: logoutClicked,
  target: logoutFx,
});
