export interface AuthUser {
  id?: number;
  username: string;
  email?: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  username: string;
  token: string;
  message: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface ApiErrorBody {
  message?: string;
  errors?: Record<string, string>;
}
