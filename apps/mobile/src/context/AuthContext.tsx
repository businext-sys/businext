import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  hasActiveSession,
  login as loginService,
  logout as logoutService,
} from "@/lib/session";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export type AuthContextValue = {
  status: AuthStatus;
  login: (
    email: string,
    password: string
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Provee el estado de sesion a toda la app (issue #029). Unico lugar que
 * decide si el usuario esta autenticado, sin conocer los detalles de
 * Supabase ni de SecureStore (eso vive en `src/lib/session.ts`).
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    hasActiveSession().then((active) => {
      setStatus(active ? "authenticated" : "unauthenticated");
    });
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await loginService(email, password);
      if (result.ok) setStatus("authenticated");
      return result;
    },
    []
  );

  const logout = useCallback(async () => {
    await logoutService();
    setStatus("unauthenticated");
  }, []);

  return (
    <AuthContext.Provider value={{ status, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return ctx;
}
