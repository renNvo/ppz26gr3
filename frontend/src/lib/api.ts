import type {
  ApiErrorBody,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from "@/types/auth";

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8080"
).replace(/\/+$/, "");

export const AUTH_TOKEN_STORAGE_KEY = "memora-token";

export class ApiError extends Error {
  public readonly status: number;
  public readonly fieldErrors?: Record<string, string>;
  public readonly isNetworkError: boolean;

  constructor(
    message: string,
    status: number,
    options?: {
      fieldErrors?: Record<string, string>;
      isNetworkError?: boolean;
    }
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = options?.fieldErrors;
    this.isNetworkError = options?.isNetworkError ?? false;
  }
}

async function parseErrorBody(response: Response): Promise<ApiErrorBody> {
  try {
    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      return (await response.json()) as ApiErrorBody;
    }
    const text = await response.text();
    return text ? { message: text } : {};
  } catch {
    return {};
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new ApiError(
      "Nie udało się połączyć z serwerem. Sprawdź, czy backend działa na porcie 8080.",
      0,
      { isNetworkError: true }
    );
  }

  if (!response.ok) {
    const body = await parseErrorBody(response);
    throw new ApiError(
      body.message || `Wystąpił błąd serwera (${response.status}).`,
      response.status,
      { fieldErrors: body.errors }
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const authApi = {
  register(payload: RegisterPayload): Promise<RegisterResponse> {
    return apiRequest<RegisterResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  login(payload: LoginPayload): Promise<LoginResponse> {
    return apiRequest<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
