import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import * as api from "@/lib/api";
import type { AuthUser, LoginPayload, RegisterPayload } from "@/lib/api";
import { clearLocalOnSignOut, configureSync } from "@/lib/sync/engine";

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

  const value = useMemo<AuthContextValue>(
    () => ({
      user: auth?.user ?? null,
      token: auth?.token ?? null,
      isLoading,
      needsFarmSetup,
      signIn: async (payload) => {
        const result = await api.login(payload);
        setNeedsFarmSetup(false);
        await persist({ token: result.access_token, user: result.user });
        configureSync(result.access_token, result.user.farm.id);
      },
      signUp: async (payload) => {
        const result = await api.register(payload);
        // Farm setup only when the server created a new farm — never when joining an existing one, so shared farm details can't be overwritten.
        setNeedsFarmSetup(result.needsFarmSetup ?? false);
        await persist({ token: result.access_token, user: result.user });
        configureSync(result.access_token, result.user.farm.id);
      },
      completeFarmSetup: () => setNeedsFarmSetup(false),
      signOut: async () => {
        setNeedsFarmSetup(false);
        clearLocalOnSignOut();
        await persist(null);
      },
    }),
    [auth, isLoading, needsFarmSetup],
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
