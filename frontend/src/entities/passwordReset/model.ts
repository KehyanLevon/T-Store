import { createEffect, createStore } from "effector";
import { http } from "../../shared/api/http";

export const forgotPasswordFx = createEffect(async (email: string) => {
  await http.post<{ message: string }, { email: string }>(
    "/api/auth/forgot-password",
    { email }
  );
});

export const verifyResetTokenFx = createEffect(async (token: string) => {
  await http.post<{ message: string }, { token: string }>(
    "/api/auth/verify-reset-token",
    { token }
  );
});

export const changePasswordFx = createEffect(async (newPassword: string) => {
  await http.post<{ message: string }, { newPassword: string }>(
    "/api/auth/change-password",
    { newPassword }
  );
});

export const $forgotPending = forgotPasswordFx.pending;
export const $verifyPending = verifyResetTokenFx.pending;
export const $changePending = changePasswordFx.pending;

export const $forgotError = createStore<string | null>(null)
  .on(forgotPasswordFx.failData, (_, e: any) => String(e?.message || "Failed"))
  .reset(forgotPasswordFx.done);

export const $verifyError = createStore<string | null>(null)
  .on(verifyResetTokenFx.failData, (_, e: any) =>
    String(e?.message || "Failed")
  )
  .reset(verifyResetTokenFx.done);

export const $changeError = createStore<string | null>(null)
  .on(changePasswordFx.failData, (_, e: any) => String(e?.message || "Failed"))
  .reset(changePasswordFx.done);
