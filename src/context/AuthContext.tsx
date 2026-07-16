import { createContext, useContext, useState, type ReactNode } from "react";
import { login as loginApi } from "../api/reports";

interface AuthValue {
  email: string | null;
  name: string | null;
  isAuthed: boolean;
  signIn: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(() => localStorage.getItem("chokchok_email"));
  const [name, setName] = useState<string | null>(() => localStorage.getItem("chokchok_name"));
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("chokchok_token"));

  const signIn = async (email: string, password: string, displayName?: string) => {
    const res = await loginApi(email, password);
    const nameToStore = displayName || res.name;
    localStorage.setItem("chokchok_token", res.token);
    localStorage.setItem("chokchok_email", res.email);
    if (nameToStore) localStorage.setItem("chokchok_name", nameToStore);
    setToken(res.token);
    setEmail(res.email);
    if (nameToStore) setName(nameToStore);
  };

  const signOut = () => {
    localStorage.removeItem("chokchok_token");
    localStorage.removeItem("chokchok_email");
    localStorage.removeItem("chokchok_name");
    setToken(null);
    setEmail(null);
    setName(null);
  };

  return (
    <AuthContext.Provider value={{ email, name, isAuthed: !!token && !!email, signIn, signOut }}>
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
