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
