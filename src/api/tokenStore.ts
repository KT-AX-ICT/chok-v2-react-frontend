export interface Tokens { accessToken: string; refreshToken: string; }
// api-spec: GET /api/auth/me → { email, name, role, companyCode, companyName }
export interface UserInfo { email: string; name: string; role: string; companyCode: string; companyName: string; }

const TOKEN_KEY = "token";
const USER_KEY = "user";

function readJson<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try { return JSON.parse(raw) as T; } catch { return null; }
}

export function getTokens(): Tokens | null { return readJson<Tokens>(TOKEN_KEY); }
export function getUser(): UserInfo | null { return readJson<UserInfo>(USER_KEY); }

export function setAuth(tokens: Tokens, user: UserInfo): void {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}
export function setTokens(tokens: Tokens): void {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
}
export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
