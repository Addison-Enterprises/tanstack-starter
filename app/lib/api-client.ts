import { env } from "./env";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  timeout?: number;
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export class ApiTimeoutError extends Error {
  constructor(url: string, timeoutMs: number) {
    super(`Request to ${url} timed out after ${String(timeoutMs)}ms`);
    this.name = "ApiTimeoutError";
  }
}

export async function isApiAvailable(): Promise<boolean> {
  if (!env.VITE_API_URL) return false;
  try {
    const res = await fetch(`${env.VITE_API_URL}/health`, {
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, timeout, ...init } = options;

  if (!env.VITE_API_URL) {
    throw new ApiError("API_URL not configured", 0);
  }

  const controller = new AbortController();
  const timeoutMs = timeout ?? env.VITE_API_TIMEOUT_MS;
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const token = localStorage.getItem("auth_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${env.VITE_API_URL}${path}`, {
      ...init,
      headers: { ...headers, ...(init.headers as Record<string, string>) },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (!res.ok) {
      const data: unknown = await res.json().catch(() => undefined);
      throw new ApiError(
        `API error: ${String(res.status)} ${res.statusText}`,
        res.status,
        data
      );
    }

    if (res.status === 204) return undefined as T;

    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiTimeoutError(`${env.VITE_API_URL}${path}`, timeoutMs);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const api = {
  get: <T>(path: string, opts?: RequestOptions): Promise<T> =>
    request<T>(path, { ...opts, method: "GET" }),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions): Promise<T> =>
    request<T>(path, { ...opts, method: "POST", body }),
  put: <T>(path: string, body?: unknown, opts?: RequestOptions): Promise<T> =>
    request<T>(path, { ...opts, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, opts?: RequestOptions): Promise<T> =>
    request<T>(path, { ...opts, method: "PATCH", body }),
  delete: <T>(path: string, opts?: RequestOptions): Promise<T> =>
    request<T>(path, { ...opts, method: "DELETE" }),
};
