"use client";

import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

export type Role = "STUDENT" | "LANDLORD" | "ADMIN";
export type KycStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  kycStatus: KycStatus;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function setApiAccessToken(token: string | null) {
  accessToken = token;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!original || error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    const url = original.url ?? "";

    if (url.includes("/auth/login") || url.includes("/auth/refresh-tokens")) {
      return Promise.reject(error);
    }

    original._retry = true;

    refreshPromise ??= axios
      .post<AuthResponse>(
        `${API_BASE_URL}/auth/refresh-tokens`,
        {},
        { withCredentials: true },
      )
      .then(({ data }) => {
        setApiAccessToken(data.accessToken);
        return data.accessToken;
      })
      .catch(() => {
        setApiAccessToken(null);
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });

    const token = await refreshPromise;

    if (!token) {
      return Promise.reject(error);
    }

    original.headers.Authorization = `Bearer ${token}`;
    return api(original);
  },
);
