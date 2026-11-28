import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AUTH_TOKEN_STORAGE_KEY, authApi } from "@/lib/api";
import { decodeJwtPayload, isTokenExpired } from "@/lib/jwt";
import type {
  AuthUser,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from "@/types/auth";

const AUTH_USER_STORAGE_KEY = "memora-user";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<LoginResponse>;
  register: (payload: RegisterPayload) => Promise<RegisterResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function clearStoredAuth() {
  try {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

function loadInitialAuthState(): AuthState {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (!token || isTokenExpired(token)) {
      clearStoredAuth();
      return { token: null, user: null };
    }

    const rawUser = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (rawUser) {
      const parsed = JSON.parse(rawUser) as AuthUser;
      if (parsed && typeof parsed.username === "string" && parsed.username) {
        return { token, user: parsed };
      }
    }

    const payload = decodeJwtPayload(token);
    if (payload?.sub) {
      return { token, user: { username: payload.sub } };
    }

    clearStoredAuth();
    return { token: null, user: null };
  } catch {
    clearStoredAuth();
    return { token: null, user: null };
  }
}

function persistAuthState(token: string, user: AuthUser) {
  try {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
  } catch {
    // Ignore storage errors
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(loadInitialAuthState);

  const login = useCallback(
    async (username: string, password: string): Promise<LoginResponse> => {
      const normalizedUsername = username.trim();
      const response = await authApi.login({
        username: normalizedUsername,
        password,
      });

      const jwtPayload = decodeJwtPayload(response.token);
      const nextUser: AuthUser = {
        username: jwtPayload?.sub || normalizedUsername,
      };

      persistAuthState(response.token, nextUser);
      setAuth({ token: response.token, user: nextUser });
      return response;
    },
    []
  );

  const register = useCallback(
    async (payload: RegisterPayload): Promise<RegisterResponse> => {
      const normalizedPayload: RegisterPayload = {
        username: payload.username.trim(),
        password: payload.password,
      };

      const response = await authApi.register(normalizedPayload);
      const nextUser: AuthUser = {
        id: response.id,
        username: response.username,
      };

      persistAuthState(response.token, nextUser);
      setAuth({ token: response.token, user: nextUser });
      return response;
    },
    []
  );

  const logout = useCallback(() => {
    clearStoredAuth();
    setAuth({ token: null, user: null });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: auth.user,
      token: auth.token,
      isAuthenticated: Boolean(auth.token && auth.user && !isTokenExpired(auth.token)),
      login,
      register,
      logout,
    }),
    [auth, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
