import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import * as api from "@/lib/api";
import type { AuthUser, LoginPayload, RegisterPayload } from "@/lib/api";
import { clearAuthTokenKeepLocal, clearLocalOnSignOut, configureSync } from "@/lib/sync/engine";

const STORAGE_KEY = "krave-auth";

interface StoredAuth {
  token: string;
  user: AuthUser;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  needsFarmSetup: boolean;
  /** One-shot notice after JWT expiry (shown on the login screen). */
  sessionExpiredNotice: string | null;
  clearSessionExpiredNotice: () => void;
  signIn: (payload: LoginPayload) => Promise<void>;
  signUp: (payload: RegisterPayload) => Promise<void>;
  completeFarmSetup: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<StoredAuth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsFarmSetup, setNeedsFarmSetup] = useState(false);
  const [sessionExpiredNotice, setSessionExpiredNotice] = useState<string | null>(null);
  const authRef = useRef<StoredAuth | null>(null);
  authRef.current = auth;

  useEffect(() => {
    SecureStore.getItemAsync(STORAGE_KEY)
      .then((raw) => {
        if (raw) setAuth(JSON.parse(raw) as StoredAuth);
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function persist(next: StoredAuth | null) {
    setAuth(next);
    if (next) {
      await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(next));
    } else {
      await SecureStore.deleteItemAsync(STORAGE_KEY);
    }
  }

  // When any authenticated API call gets 401, drop the session but keep offline data.
  useEffect(() => {
    api.setUnauthorizedHandler(() => {
      if (!authRef.current) return;
      clearAuthTokenKeepLocal();
      setNeedsFarmSetup(false);
      setSessionExpiredNotice("Seja je potekla. Prijavi se znova.");
      void persist(null);
    });
    return () => api.setUnauthorizedHandler(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: auth?.user ?? null,
      token: auth?.token ?? null,
      isLoading,
      needsFarmSetup,
      sessionExpiredNotice,
      clearSessionExpiredNotice: () => setSessionExpiredNotice(null),
      signIn: async (payload) => {
        const result = await api.login(payload);
        setNeedsFarmSetup(false);
        setSessionExpiredNotice(null);
        await persist({ token: result.access_token, user: result.user });
        configureSync(result.access_token, result.user.farm.id);
      },
      signUp: async (payload) => {
        const result = await api.register(payload);
        // Farm setup only when the server created a new farm — never when joining an existing one, so shared farm details can't be overwritten.
        setNeedsFarmSetup(result.needsFarmSetup ?? false);
        setSessionExpiredNotice(null);
        await persist({ token: result.access_token, user: result.user });
        configureSync(result.access_token, result.user.farm.id);
      },
      completeFarmSetup: () => setNeedsFarmSetup(false),
      signOut: async () => {
        setNeedsFarmSetup(false);
        setSessionExpiredNotice(null);
        clearLocalOnSignOut();
        await persist(null);
      },
    }),
    [auth, isLoading, needsFarmSetup, sessionExpiredNotice],
  );

  // Restore sync config when auth hydrates from SecureStore.
  useEffect(() => {
    if (isLoading) return;
    if (auth) {
      configureSync(auth.token, auth.user.farm.id);
    }
  }, [isLoading, auth?.token, auth?.user.farm.id]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
