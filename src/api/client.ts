import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getTokens, setTokens, clearAuth } from "./tokenStore";

// api-spec: 에러 응답 공통 봉투 — {"error":{"code":"...","message":"..."}}
export interface ApiErrorResponse { error: { code: string; message: string } }

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const tokens = getTokens();
  if (tokens?.accessToken) config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  return config;
});

// 401 → RTR: refresh 로 access+refresh 재발급 후 원요청 재시도. 동시 401 은 큐잉해 refresh 1회만.
let isRefreshing = false;
let waiters: ((newAccess: string | null) => void)[] = [];

function forceLogout() {
  clearAuth();
  window.location.href = "/login";
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;
    const url = original?.url ?? "";

    // 401 아님 / 이미 재시도함 / auth 엔드포인트 자체면 그대로 실패
    if (error.response?.status !== 401 || !original || original._retried || url.includes("/auth/")) {
      return Promise.reject(error);
    }
    original._retried = true;

    const tokens = getTokens();
    if (!tokens?.refreshToken) { forceLogout(); return Promise.reject(error); }

    // 이미 refresh 진행 중이면 완료를 기다렸다가 재시도
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        waiters.push((newAccess) => {
          if (!newAccess) return reject(error);
          original.headers.Authorization = `Bearer ${newAccess}`;
          resolve(api(original));
        });
      });
    }

    isRefreshing = true;
    try {
      // 인터셉터 재귀 방지를 위해 순수 axios 로 호출
      const { data } = await axios.post<{ accessToken: string; refreshToken: string }>(
        `${BASE_URL}/api/auth/refresh`,
        { refreshToken: tokens.refreshToken },
      );
      setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      waiters.forEach((w) => w(data.accessToken));
      waiters = [];
      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(original);
    } catch (refreshErr) {
      waiters.forEach((w) => w(null));
      waiters = [];
      forceLogout();
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  },
);
