# 로그인/인증 붙이기 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** chok-v2 프론트에 실 로그인(이메일/비번 → JWT access/refresh + 유저정보)을 붙이고, 라우트 가드·404·마이페이지를 추가한다.

**Architecture:** 토큰/유저는 localStorage 2키(`token`·`user`) + 전용 스토어. axios 요청 인터셉터가 Bearer 를 붙이고, 응답 인터셉터가 401에서 RTR로 재발급·재시도. AuthContext가 상태, RequireAuth가 `/app/*` 가드, 앱 레벨 ToastProvider가 로그인 성공 알림을 표시.

**Tech Stack:** React 18, react-router-dom 7, axios 1.7, TypeScript 5.7(strict), Vite 6. **테스트 러너 없음** — 검증은 `npx tsc -b`(project references라 `-b` 필수) + Playwright 헤드리스 구동.

## Global Constraints

- localStorage 키는 정확히 **`token`**(=`{accessToken, refreshToken}` JSON)·**`user`**(=`{name, companyName, companyCode}` JSON) 만.
- 모든 API 요청에 `Authorization: Bearer <accessToken>` 자동 첨부.
- 이메일: 형식 + 12~30자. 비밀번호: 8~15자, 허용 `A-Za-z!@#`, 대·소문자·`!@#` 각 1개 이상 필수.
- 검증 타이밍: on blur + on submit (실시간 없음).
- **입력 형식 오류 = 필드별 인라인** / **로그인 실패 = 폼 인라인 메시지** / **로그인 성공 = 토스트**.
- 로그인 후 착지 = **`/app/dashboard`** (임시, 추후 변경 가능).
- 라우팅: **미인증 → `/login`**, **인증 상태 잘못된 URL → 404 페이지**(앱 셸 안).
- 타입검사 `npx tsc -b`. **git 반영(브랜치·커밋·푸시)은 사용자 합의 후에만** — 실행 시 main에서 새 브랜치, 각 커밋 전 확인.
- **비밀번호 찾기·변경은 미구현**(플랜만, 부록). 로그인 화면 비번찾기 진입 숨김.

---

## File Structure

- `src/api/tokenStore.ts` (신설) — 토큰/유저 저장·조회·삭제 + 타입 (공용 import, 순환참조 방지)
- `src/api/auth.ts` (신설) — `loginRequest`
- `src/api/client.ts` (수정) — Bearer 요청 인터셉터 + 401 RTR 응답 인터셉터
- `src/context/AuthContext.tsx` (재작성) — 2키 모델
- `src/context/ToastContext.tsx` (신설) — 앱 레벨 토스트
- `src/utils/validateMessages.ts` (수정) — `validateLoginEmail`·`validateLoginPassword`
- `src/pages/Login/LoginForm.tsx` (수정) — 필드 인라인 오류·힌트 + 폼 오류 슬롯, 회원가입/비번찾기 진입 제거
- `src/pages/Login/index.tsx` (재작성) — 로그인 배선(검증·인라인 실패·성공 토스트·인증 시 리다이렉트)
- `src/pages/Login/SignupForm.tsx` (삭제)
- `src/pages/MyPage/index.tsx` (신설) + `src/styles/pages/mypage.css` (신설)
- `src/pages/NotFound/index.tsx` (신설) + `src/styles/pages/not-found.css` (신설) — 범용 404
- `src/components/layout/Sidebar.tsx` (수정) — 유저영역·로그아웃·마이페이지 링크
- `src/App.tsx` (수정) — `/login`·가드·`/app/mypage`·404 라우팅
- `src/main.tsx` (수정) — `AuthProvider`·`ToastProvider` 활성화
- `src/styles/components/toast.css` (신설) — 토스트 스타일
- `src/components/layout/RequireAuth.tsx` (그대로) — 이미 미인증 시 `/login` 리다이렉트

---

## Task 1: 토큰/유저 스토어 + 로그인 API

**Files:** Create `src/api/tokenStore.ts`, `src/api/auth.ts`

**Interfaces — Produces:** `Tokens{accessToken;refreshToken}`, `UserInfo{name;companyName;companyCode}`, `LoginResponse=Tokens&UserInfo`, `getTokens()`, `getUser()`, `setAuth(t,u)`, `setTokens(t)`, `clearAuth()`, `loginRequest(email,password):Promise<LoginResponse>`.

- [ ] **Step 1: `src/api/tokenStore.ts`**

```ts
export interface Tokens { accessToken: string; refreshToken: string; }
export interface UserInfo { name: string; companyName: string; companyCode: string; }

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
export function setTokens(tokens: Tokens): void { localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens)); }
export function clearAuth(): void { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); }
```

- [ ] **Step 2: `src/api/auth.ts`**

```ts
import { api } from "./client";
import type { Tokens, UserInfo } from "./tokenStore";

export type LoginResponse = Tokens & UserInfo; // POST /auth/login 응답

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", { email, password });
  return data;
}
```

- [ ] **Step 3: 타입검사** — `npx tsc -b` → exit 0
- [ ] **Step 4: 커밋(합의 후)** — `git commit -m "feat(auth): 토큰 스토어 + 로그인 API"`

---

## Task 2: Bearer 헤더 + RTR 인터셉터

**Files:** Modify (전체 교체) `src/api/client.ts`

**Interfaces — Consumes:** `getTokens`,`setTokens`,`clearAuth`(T1). **Produces:** 인터셉터 붙은 `api`.

- [ ] **Step 1: `src/api/client.ts` 전체 교체**

```ts
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getTokens, setTokens, clearAuth } from "./tokenStore";

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

let isRefreshing = false;
let waiters: ((newAccess: string | null) => void)[] = [];
function forceLogout() { clearAuth(); window.location.href = "/login"; }

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;
    const url = original?.url ?? "";
    if (error.response?.status !== 401 || !original || original._retried || url.includes("/auth/")) {
      return Promise.reject(error);
    }
    original._retried = true;
    const tokens = getTokens();
    if (!tokens?.refreshToken) { forceLogout(); return Promise.reject(error); }
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
      const { data } = await axios.post<{ accessToken: string; refreshToken: string }>(
        `${BASE_URL}/auth/refresh`, { refreshToken: tokens.refreshToken },
      );
      setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      waiters.forEach((w) => w(data.accessToken)); waiters = [];
      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(original);
    } catch (refreshErr) {
      waiters.forEach((w) => w(null)); waiters = [];
      forceLogout();
      return Promise.reject(refreshErr);
    } finally { isRefreshing = false; }
  },
);
```

- [ ] **Step 2:** `npx tsc -b` → exit 0
- [ ] **Step 3:** 커밋(합의 후) — `git commit -m "feat(auth): Bearer 헤더 + 401 RTR 인터셉터"`

---

## Task 3: AuthContext 재작성

**Files:** Modify (전체 교체) `src/context/AuthContext.tsx`

**Interfaces — Consumes:** `getUser/getTokens/setAuth/clearAuth`,`UserInfo`(T1), `loginRequest`(T1). **Produces:** `useAuth()`→`{user:UserInfo|null; isAuthed:boolean; signIn(email,password):Promise<void>; signOut():void}`.

- [ ] **Step 1: 전체 교체**

```tsx
import { createContext, useContext, useState, type ReactNode } from "react";
import { loginRequest } from "../api/auth";
import { getTokens, getUser, setAuth, clearAuth, type UserInfo } from "../api/tokenStore";

interface AuthValue {
  user: UserInfo | null;
  isAuthed: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}
const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(() => getUser());
  const [authed, setAuthed] = useState<boolean>(() => !!getTokens()?.accessToken);

  const signIn = async (email: string, password: string) => {
    const res = await loginRequest(email, password);
    const nextUser: UserInfo = { name: res.name, companyName: res.companyName, companyCode: res.companyCode };
    setAuth({ accessToken: res.accessToken, refreshToken: res.refreshToken }, nextUser);
    setUser(nextUser); setAuthed(true);
  };
  const signOut = () => { clearAuth(); setUser(null); setAuthed(false); };

  return <AuthContext.Provider value={{ user, isAuthed: authed, signIn, signOut }}>{children}</AuthContext.Provider>;
}
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
```

- [ ] **Step 2:** `npx tsc -b` → 통과 예상(`Login/index.tsx`는 `@ts-nocheck`라 억제, App은 아직 미import). FAIL 나면 깨진 참조 기록 → 후속 태스크에서 정리. 커밋은 화면 배선 후 통합.

---

## Task 4: 로그인 검증 함수

**Files:** Modify `src/utils/validateMessages.ts` (최상단에 활성 export 추가)

**Interfaces — Produces:** `validateLoginEmail(email):string|null`, `validateLoginPassword(pw):string|null`.

- [ ] **Step 1: 파일 최상단에 삽입**

```ts
export function validateLoginEmail(email: string): string | null {
  const v = email.trim();
  if (!v) return "이메일을 입력해 주세요.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "이메일 형식이 아닙니다.";
  if (v.length < 12 || v.length > 30) return "이메일은 12~30자로 입력해 주세요.";
  return null;
}
export function validateLoginPassword(pw: string): string | null {
  if (!pw) return "비밀번호를 입력해 주세요.";
  if (!/^[A-Za-z!@#]{8,15}$/.test(pw)) return "8~15자, 영문 대/소문자와 !@# 만 사용할 수 있습니다.";
  if (!/[A-Z]/.test(pw) || !/[a-z]/.test(pw) || !/[!@#]/.test(pw)) return "대문자·소문자·!@# 를 각각 1개 이상 포함해야 합니다.";
  return null;
}
```

- [ ] **Step 2:** `npx tsc -b` (이 파일 관련 오류 없음)

---

## Task 5: 앱 레벨 토스트 + Provider 활성화

**Files:** Create `src/context/ToastContext.tsx`, `src/styles/components/toast.css`; Modify `src/main.tsx`

**Interfaces — Produces:** `useToast()`→`{showToast(msg:string):void}`. Provider가 앱 루트에서 토스트를 렌더(라우트 전환에도 유지, 2.5초 후 자동 사라짐).

- [ ] **Step 1: `src/context/ToastContext.tsx`**

```tsx
import { createContext, useContext, useRef, useState, useCallback, type ReactNode } from "react";
import "../styles/components/toast.css";

interface ToastValue { showToast: (msg: string) => void; }
const ToastContext = createContext<ToastValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const showToast = useCallback((msg: string) => {
    setMessage(msg);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMessage(null), 2500);
  }, []);
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && <div role="status" className="toast">{message}</div>}
    </ToastContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export function useToast(): ToastValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
```

- [ ] **Step 2: `src/styles/components/toast.css`**

```css
.toast {
  position: fixed; left: 50%; bottom: 32px; transform: translateX(-50%);
  background: var(--text1); color: var(--surface);
  padding: 10px 18px; border-radius: 999px; font: 600 13px system-ui;
  box-shadow: 0 6px 24px rgba(0,0,0,.18); z-index: 1000;
  animation: toast-in .18s ease-out;
}
@keyframes toast-in { from { opacity: 0; transform: translate(-50%, 8px); } to { opacity: 1; transform: translate(-50%, 0); } }
```

- [ ] **Step 3: `src/main.tsx` — AuthProvider·ToastProvider 활성화** (전체 교체)

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import "./index.css";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Missing #root element");
createRoot(rootEl).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ToastProvider>
            <App />
          </ToastProvider>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
```

- [ ] **Step 4:** `npx tsc -b` → exit 0

---

## Task 6: LoginForm — 필드 인라인 오류·힌트, 회원가입/비번찾기 제거

**Files:** Modify (전체 교체) `src/pages/Login/LoginForm.tsx`

**Interfaces — Produces (Props):** `{ email; password; loading; emailError?; passwordError?; formError?; onEmailChange; onPasswordChange; onEmailBlur; onPasswordBlur; onSubmit }`. (`onForgot`·`onSignup` 제거)

- [ ] **Step 1: 전체 교체**

```tsx
import { Loader2 } from "lucide-react";

interface Props {
  email: string; password: string; loading: boolean;
  emailError?: string | null; passwordError?: string | null; formError?: string | null;
  onEmailChange: (v: string) => void; onPasswordChange: (v: string) => void;
  onEmailBlur: () => void; onPasswordBlur: () => void;
  onSubmit: (e: React.FormEvent) => void;
}
const errStyle = { font: "12px system-ui", color: "#ef4444" } as const;

export default function LoginForm({
  email, password, loading, emailError, passwordError, formError,
  onEmailChange, onPasswordChange, onEmailBlur, onPasswordBlur, onSubmit,
}: Props) {
  return (
    <div className="login-form-inner">
      <h2 className="login-title">로그인</h2>
      <p className="login-subtitle">계정에 로그인해 RCA 리포트를 확인하세요.</p>
      <form onSubmit={onSubmit} className="login-form" noValidate>
        <div>
          <label htmlFor="login-email" className="login-label">이메일</label>
          <input id="login-email" type="email" placeholder="name@company.com"
            value={email} onChange={(e) => onEmailChange(e.target.value)} onBlur={onEmailBlur} className="login-input" />
          {emailError && <span style={errStyle}>{emailError}</span>}
        </div>
        <div>
          <label htmlFor="login-password" className="login-label">비밀번호</label>
          <input id="login-password" type="password" placeholder="••••••••"
            value={password} onChange={(e) => onPasswordChange(e.target.value)} onBlur={onPasswordBlur} className="login-input" />
          <span style={{ font: "11px system-ui", color: "var(--text3)" }}>8~15자 · 대/소문자 · !@# 포함</span>
          {passwordError && <div><span style={errStyle}>{passwordError}</span></div>}
        </div>
        {formError && <span style={errStyle}>{formError}</span>}
        <button type="submit" disabled={loading} className="login-primary-btn">
          {loading ? (<><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />로그인 중...</>) : "로그인"}
        </button>
      </form>
    </div>
  );
}
```

> 회원가입 링크·비번찾기 버튼·"로그인 유지" 행 제거.

- [ ] **Step 2:** `npx tsc -b` (Task 7까지 후 전체 통과)

---

## Task 7: Login/index 배선 + SignupForm 삭제

**Files:** Modify (전체 교체) `src/pages/Login/index.tsx`; Delete `src/pages/Login/SignupForm.tsx`; (필요 시) 정리 `src/api/reports.ts`

**Interfaces — Consumes:** `useAuth().signIn/isAuthed`(T3), `useToast().showToast`(T5), `validateLoginEmail/Password`(T4), `LoginForm`(T6).

- [ ] **Step 1: `src/pages/Login/index.tsx` 전체 교체**

```tsx
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import Logo from "../../components/ui/Logo";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { validateLoginEmail, validateLoginPassword } from "../../utils/validateMessages";
import LoginForm from "./LoginForm";
import "../../styles/pages/login.css";

export default function Login() {
  const nav = useNavigate();
  const { signIn, isAuthed } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (isAuthed) return <Navigate to="/app/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eErr = validateLoginEmail(email);
    const pErr = validateLoginPassword(password);
    setEmailError(eErr); setPasswordError(pErr); setFormError(null);
    if (eErr || pErr) return;
    setLoading(true);
    try {
      await signIn(email, password);
      showToast("로그인되었습니다.");            // 성공 = 토스트
      nav("/app/dashboard");
    } catch (err) {
      const status = err instanceof AxiosError ? err.response?.status : undefined;
      setFormError(status === 401 || status === 400   // 실패 = 폼 인라인
        ? "이메일 또는 비밀번호가 올바르지 않습니다."
        : "로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      setLoading(false);
    }
  };

  return (
    <div className="screen login-page">
      <div className="login-logo"><Logo onClick={() => nav("/")} /></div>
      <div className="login-box">
        <LoginForm
          email={email} password={password} loading={loading}
          emailError={emailError} passwordError={passwordError} formError={formError}
          onEmailChange={setEmail} onPasswordChange={setPassword}
          onEmailBlur={() => setEmailError(validateLoginEmail(email))}
          onPasswordBlur={() => setPasswordError(validateLoginPassword(password))}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2:** `rm src/pages/Login/SignupForm.tsx`
- [ ] **Step 3:** `src/api/reports.ts` 의 mock `login`/`AuthResult`/`MOCK_DEMO` 가 미사용이면 제거(`npx tsc -b` 로 확인 후). `ForgotForm.tsx` 는 import 안 하므로 그대로 둠.
- [ ] **Step 4:** `npx tsc -b` → exit 0

---

## Task 8: 마이페이지 + 404 페이지

**Files:** Create `src/pages/MyPage/index.tsx`, `src/styles/pages/mypage.css`, `src/pages/NotFound/index.tsx`, `src/styles/pages/not-found.css`

**Interfaces — Consumes:** `useAuth().user`(T3). **Produces:** `MyPage`, `NotFound` default exports (Task 9 라우팅이 사용).

- [ ] **Step 1: `src/pages/MyPage/index.tsx`**

```tsx
import { useAuth } from "../../context/AuthContext";
import SectionHeader from "../../components/ui/SectionHeader";
import "../../styles/pages/mypage.css";

export default function MyPage() {
  const { user } = useAuth();
  const rows = [
    { label: "이름", value: user?.name ?? "-" },
    { label: "소속 기업", value: user?.companyName ?? "-" },
    { label: "기업 코드", value: user?.companyCode ?? "-" },
  ];
  return (
    <div className="screen mypage">
      <div className="mypage__title">마이페이지</div>
      <div className="mypage__card">
        <SectionHeader label="내 정보" />
        <div className="mypage__rows">
          {rows.map((r) => (
            <div key={r.label} className="mypage__row">
              <span className="mypage__label">{r.label}</span>
              <span className="mypage__value">{r.value}</span>
            </div>
          ))}
        </div>
        {/* 플랜: 비밀번호 변경 섹션(부록 A) — 이번엔 미구현 */}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: `src/styles/pages/mypage.css`**

```css
.mypage { padding: 24px; }
.mypage__title { font: 800 20px system-ui; color: var(--text1); margin-bottom: 16px; }
.mypage__card { background: var(--surface); border: 1px solid var(--border2); border-radius: 12px; padding: 18px 20px; max-width: 480px; }
.mypage__rows { display: flex; flex-direction: column; gap: 12px; margin-top: 12px; }
.mypage__row { display: flex; gap: 16px; align-items: baseline; }
.mypage__label { width: 96px; flex-shrink: 0; font: 700 12px system-ui; color: var(--text3); }
.mypage__value { font: 14px system-ui; color: var(--text1); }
```

- [ ] **Step 3: `src/pages/NotFound/index.tsx`** (범용 404)

```tsx
import { useNavigate } from "react-router-dom";
import "../../styles/pages/not-found.css";

export default function NotFound() {
  const nav = useNavigate();
  return (
    <div className="screen notfound">
      <div className="notfound__code">404</div>
      <div className="notfound__title">페이지를 찾을 수 없습니다</div>
      <button type="button" className="notfound__btn" onClick={() => nav("/app/dashboard")}>
        대시보드로 돌아가기
      </button>
    </div>
  );
}
```

- [ ] **Step 4: `src/styles/pages/not-found.css`**

```css
.notfound { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 80px 24px; text-align: center; }
.notfound__code { font: 800 48px system-ui; color: var(--brand); }
.notfound__title { font: 700 16px system-ui; color: var(--text1); }
.notfound__btn { margin-top: 8px; padding: 8px 16px; border-radius: 8px; border: none; background: var(--brand); color: #fff; font: 600 13px system-ui; cursor: pointer; }
```

- [ ] **Step 5:** `npx tsc -b` → exit 0

---

## Task 9: 라우팅 · 가드 · 404

**Files:** Modify (전체 교체) `src/App.tsx`

**Interfaces — Consumes:** `Login`(T7), `RequireAuth`(기존), `MyPage`·`NotFound`(T8).

- [ ] **Step 1: `src/App.tsx` 전체 교체**

```tsx
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import RequireAuth from "./components/layout/RequireAuth";
import AppShell from "./components/layout/AppShell";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import ReportDetail from "./pages/ReportDetail";
import MyPage from "./pages/MyPage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/app" element={<RequireAuth><AppShell /></RequireAuth>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="reports" element={<Reports />} />
        <Route path="reports/:id" element={<ReportDetail />} />
        <Route path="mypage" element={<MyPage />} />
        <Route path="*" element={<NotFound />} />           {/* 인증 상태에서 잘못된 /app/* → 404(셸 안) */}
      </Route>
      <Route path="*" element={<Navigate to="/app/404" replace />} />  {/* 최상위 잘못된 URL → /app로 → 인증 시 404, 미인증 시 /login */}
    </Routes>
  );
}
```

> 흐름: 미인증으로 `/app/*`·잘못된 URL 접근 → RequireAuth가 `/login`. 인증 상태 잘못된 URL → 404(사이드바 있는 셸 안). 인증 상태로 `/login` → Login이 `/app/dashboard`로 리다이렉트(T7).

- [ ] **Step 2:** `npx tsc -b` → exit 0
- [ ] **Step 3: 통합 커밋(합의 후)**

```bash
git add src/context/AuthContext.tsx src/context/ToastContext.tsx src/styles/components/toast.css \
  src/utils/validateMessages.ts src/pages/Login src/pages/MyPage src/pages/NotFound \
  src/styles/pages/mypage.css src/styles/pages/not-found.css src/main.tsx src/App.tsx src/api/reports.ts
git commit -m "feat(auth): 로그인 배선·성공 토스트·라우트 가드·404·마이페이지, 회원가입 제거"
```

---

## Task 10: Sidebar 유저영역·로그아웃·마이페이지 링크

**Files:** Modify `src/components/layout/Sidebar.tsx`

**Interfaces — Consumes:** `useAuth().user/signOut`(T3).

- [ ] **Step 1: 상단 import 활성화**

```tsx
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutGrid, List, LogOut } from "lucide-react";
import Logo from "../ui/Logo";
import { useAuth } from "../../context/AuthContext";
import "../../styles/components/sidebar.css";
```

- [ ] **Step 2: 컴포넌트 상단에서 auth 사용**

```tsx
export default function Sidebar() {
  const nav = useNavigate();
  const { user, signOut } = useAuth();
  const displayName = user?.name ?? "사용자";
  const company = user?.companyName ?? "-";
  const avatar = displayName[0]?.toUpperCase() ?? "U";
  const handleLogout = () => { signOut(); nav("/login", { replace: true }); };
  // ...기존 nav/pipeline JSX 그대로...
```

- [ ] **Step 3: 사이드바 하단 유저영역(기존 주석 블록 대체)**

```tsx
      <div className="sidebar__user">
        <NavLink to="/app/mypage" className="sidebar__user-link" aria-label="마이페이지">
          <div className="sidebar__avatar">{avatar}</div>
          <div className="sidebar__user-info">
            <div className="sidebar__user-name">{displayName}</div>
            <div className="sidebar__user-company">{company}</div>
          </div>
        </NavLink>
        <button type="button" onClick={handleLogout} className="sidebar__logout" aria-label="로그아웃">
          <LogOut size={15} /> 로그아웃
        </button>
      </div>
```

> `.sidebar__user*` 클래스가 `sidebar.css`에 없으면 최소 스타일(플렉스·간격·hover) 추가.

- [ ] **Step 4:** `npx tsc -b` → exit 0
- [ ] **Step 5:** 커밋(합의 후) — `git commit -m "feat(auth): 사이드바 유저영역·로그아웃·마이페이지 링크"`

---

## Task 11: 성공 경로 E2E 검증 (임시 스텁)

백엔드 로그인 미구현 → 성공 경로는 임시 스텁으로 구동 확인 후 스텁 제거.

- [ ] **Step 1: 스텁** — `/auth/login`→`{accessToken,refreshToken,name,companyName,companyCode}`, `/auth/refresh`→`{accessToken,refreshToken}` 반환하는 로컬 http 스텁 기동. `.env.local` `VITE_API_BASE_URL` 을 스텁 포트로 임시 변경.
- [ ] **Step 2:** `npm run dev -- --port 5173 --strictPort`
- [ ] **Step 3: Playwright 헤드리스로 확인(스크린샷 없이 상태 수집)**
  1. 미인증 `/app/dashboard` → `/login` 리다이렉트
  2. 이메일 형식/길이 위반 blur → 필드 인라인 오류
  3. 비번 규칙 위반 blur → 필드 인라인 오류
  4. 자격 오류(스텁 401) → **폼 인라인** "이메일 또는 비밀번호가 올바르지 않습니다"
  5. 유효 입력 + 스텁 200 → **토스트** "로그인되었습니다" + `/app/dashboard` 이동 + `localStorage.token`/`user` 저장
  6. 사이드바 유저영역(이름·회사), `/app/mypage` 기업명·기업코드 표시
  7. 로그아웃 → localStorage 비고 `/login`
  8. 인증 상태 `/app/zzz` → **404 페이지**(셸 안); 미인증 `/zzz` → `/login`
  9. (RTR) 첫 access 만료(스텁이 401) → refresh 후 재시도 성공
- [ ] **Step 4:** `.env.local` 원복(`http://localhost:8080`), 스텁 종료, `git status` 잔재 없음 확인
- [ ] **Step 5:** `npx tsc -b` → exit 0

---

## 부록 — 플랜만 (이번 미구현)

### A. 마이페이지 비밀번호 변경 (후순위)
- 백엔드: `POST /auth/password` req `{currentPassword, newPassword}` res 204/오류. 서버가 현재 비번 검증 + 새 비번 규칙 + 해시 저장.
- 프론트: 마이페이지에 변경 섹션(현재/새/새확인), 새 비번은 §검증 재사용, Bearer 호출, 성공/실패 안내.
- **로그인 작업 완료 후 사용자에게 확인하고 착수.**

### B. 비밀번호 찾기 실제 재설정 (후순위)
- 백엔드: `POST /auth/password/forgot`(이메일→토큰/메일), `POST /auth/password/reset`(토큰+새 비번).
- 프론트: `ForgotForm.tsx`(휴면) 부활 + 재설정 화면, 로그인 화면 진입 링크 노출.
- 백엔드 재설정 API 확정 후 착수.
