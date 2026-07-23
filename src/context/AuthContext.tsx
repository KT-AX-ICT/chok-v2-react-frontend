import { createContext, useContext, useState, type ReactNode } from "react";
import { loginRequest, fetchMe } from "../api/auth";
import { getTokens, getUser, setAuth, setTokens, clearAuth, type UserInfo } from "../api/tokenStore";

interface AuthValue {
  user: UserInfo | null;
  isAuthed: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // localStorage(tokenStore)에서 초기값을 동기로 읽어와, 새로고침해도 로그인 상태가 끊기지 않게 한다
  const [user, setUser] = useState<UserInfo | null>(() => getUser());
  const [authed, setAuthed] = useState<boolean>(() => !!getTokens()?.accessToken);

  const signIn = async (email: string, password: string) => {
    // 로그인 응답엔 토큰만 온다 — 토큰을 먼저 저장해야 /auth/me 요청에 Authorization이 붙는다
    const { accessToken, refreshToken } = await loginRequest(email, password);
    setTokens({ accessToken, refreshToken });
    try {
      const nextUser = await fetchMe();
      // setAuth: localStorage 영속화, setUser/setAuthed: 리액트 상태 동기화
      setAuth({ accessToken, refreshToken }, nextUser);
      setUser(nextUser);
      setAuthed(true);
    } catch (err) {
      // /auth/me 실패 시 로그인 자체를 실패로 취급 — 반쪽짜리 인증 상태를 남기지 않는다
      clearAuth();
      throw err;
    }
  };

  const signOut = () => {
    clearAuth();
    setUser(null);
    setAuthed(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthed: authed, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
