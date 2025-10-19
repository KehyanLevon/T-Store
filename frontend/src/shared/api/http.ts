const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

interface RequestOptions<T> {
  body?: T;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
}

async function request<R, B = unknown>(
  method: HttpMethod,
  endpoint: string,
  options: RequestOptions<B> = {}
): Promise<R> {
  const { body, headers, credentials } = options;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: credentials ?? "include",
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");

    let parsed: any = null;
    try {
      parsed = errorText ? JSON.parse(errorText) : null;
    } catch {
      parsed = null;
    }

    const base = `HTTP ${response.status}`;
    const msgFromJson =
      parsed?.error || parsed?.message || parsed?.detail || null;

    const msgFromText = errorText.replace(/^HTTP\s+\d+:\s*/i, "").trim();

    const message = String(msgFromJson || msgFromText || base);

    const err: any = new Error(message);
    err.status = response.status;
    err.data = parsed ?? errorText;
    throw err;
  }
  // TODO: try to remove 'ts-expect-error' comments
  if (response.status === 204) {
    // @ts-expect-error
    return undefined;
  }

  const ct = response.headers.get("content-type") || "";
  const raw = await response.text().catch(() => "");
  if (!raw) {
    // @ts-expect-error
    return undefined;
  }

  if (ct.includes("application/json")) {
    return JSON.parse(raw) as R;
  }

  // @ts-expect-error
  return raw;
}

export const http = {
  get: <R>(url: string, opts?: RequestOptions<never>) =>
    request<R>("GET", url, opts),
  post: <R, B>(url: string, body: B, opts?: Omit<RequestOptions<B>, "body">) =>
    request<R, B>("POST", url, { ...opts, body }),
  patch: <R, B>(url: string, body: B, opts?: Omit<RequestOptions<B>, "body">) =>
    request<R, B>("PATCH", url, { ...opts, body }),
  delete: <R>(url: string, opts?: RequestOptions<never>) =>
    request<R>("DELETE", url, opts),
};
