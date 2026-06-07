"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  api,
  setApiAccessToken,
  type AuthResponse,
  type AuthUser,
  type Role,
} from "@/lib/api";

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput extends LoginInput {
  name: string;
  role: Role;
}

interface KycUploadInput {
  documentType: "RG" | "CNH" | "PASSPORT" | "STUDENT_ID";
  filename: string;
  contentType: string;
}

export interface KycUploadIntent {
  documentId: string;
  method: "PUT";
  uploadUrl: string;
  storageKey: string;
  expiresAt: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  requestKycUpload: (input: KycUploadInput) => Promise<KycUploadIntent>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const applySession = useCallback((session: AuthResponse) => {
    setUser(session.user);
    setAccessToken(session.accessToken);
    setApiAccessToken(session.accessToken);
  }, []);

  useEffect(() => {
    api
      .post<AuthResponse>("/auth/refresh-tokens", {})
      .then(({ data }) => applySession(data))
      .catch(() => {
        setUser(null);
        setAccessToken(null);
        setApiAccessToken(null);
      })
      .finally(() => setIsLoading(false));
  }, [applySession]);

  const login = useCallback(
    async (input: LoginInput) => {
      const { data } = await api.post<AuthResponse>("/auth/login", input);
      applySession(data);
    },
    [applySession],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      const { data } = await api.post<AuthResponse>("/auth/register", input);
      applySession(data);
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
      setAccessToken(null);
      setApiAccessToken(null);
    }
  }, []);

  const requestKycUpload = useCallback(async (input: KycUploadInput) => {
    const { data } = await api.post<KycUploadIntent>(
      "/kyc/upload-intents",
      input,
    );
    return data;
  }, []);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isLoading,
      login,
      register,
      logout,
      requestKycUpload,
    }),
    [accessToken, isLoading, login, logout, register, requestKycUpload, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
