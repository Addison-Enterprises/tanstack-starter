import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { env } from "~/lib/env";
import { api } from "~/lib/api-client";

export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image?: string;
}

export interface Session {
  token: string;
  expiresAt: string;
  user: User;
}

interface AuthState {
  status: "loading" | "authenticated" | "unauthenticated";
  session: Session | null;
  user: User | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  authEnabled: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function useAuthProvider(): AuthContextValue {
  const [state, setState] = useState<AuthState>({
    status: "loading",
    session: null,
    user: null,
  });
  const authEnabled = env.VITE_AUTH_ENABLED;

  useEffect(() => {
    if (!authEnabled) {
      setState({ status: "unauthenticated", session: null, user: null });
      return;
    }

    const stored = localStorage.getItem("auth_token");
    const userStr = localStorage.getItem("auth_user");
    if (stored && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        setState({
          status: "authenticated",
          session: { token: stored, expiresAt: "", user },
          user,
        });
        return;
      } catch {
        /* corrupt stored data */
      }
    }
    setState({ status: "unauthenticated", session: null, user: null });
  }, [authEnabled]);

  const login = useCallback(
    async (email: string, password: string) => {
      if (!authEnabled) {
        console.warn("[auth] login called but auth is disabled");
        return;
      }
      const data = await api.post<{
        token: string;
        user: User;
        expiresAt: string;
      }>("/auth/sign-in", { email, password });
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      setState({
        status: "authenticated",
        session: { ...data, user: data.user },
        user: data.user,
      });
    },
    [authEnabled]
  );

  const logout = useCallback(async () => {
    if (authEnabled) {
      try {
        await api.post("/auth/sign-out");
      } catch {
        /* best-effort */
      }
    }
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setState({ status: "unauthenticated", session: null, user: null });
  }, [authEnabled]);

  const signup = useCallback(
    async (email: string, password: string, name: string) => {
      if (!authEnabled) {
        console.warn("[auth] signup called but auth is disabled");
        return;
      }
      const data = await api.post<{
        token: string;
        user: User;
        expiresAt: string;
      }>("/auth/sign-up", { email, password, name });
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      setState({
        status: "authenticated",
        session: { ...data, user: data.user },
        user: data.user,
      });
    },
    [authEnabled]
  );

  return { ...state, login, logout, signup, authEnabled };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useAuthProvider();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}
