import { api } from "./client";
import type { Tokens, UserInfo } from "./tokenStore";

// api-spec: POST /api/auth/login → { accessToken, refreshToken, tokenType, expiresIn } — 유저 정보는 안 옴
export type TokenResponse = Tokens & { tokenType: string; expiresIn: number };

export async function loginRequest(email: string, password: string): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>("/api/auth/login", { email, password });
  return data;
}

// api-spec: GET /api/auth/me → 로그인 성공 후 이어서 호출해 유저 정보를 받아온다 (토큰엔 유저 정보가 없음)
export async function fetchMe(): Promise<UserInfo> {
  const { data } = await api.get<UserInfo>("/api/auth/me");
  return data;
}
