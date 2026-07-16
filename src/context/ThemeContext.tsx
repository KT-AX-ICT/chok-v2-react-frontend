import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface ThemeValue {
  dark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState<boolean>(() => localStorage.getItem("chokchok_dark") === "1");

  useEffect(() => {
    if (dark) {
      document.documentElement.setAttribute("data-dark", "1");
      localStorage.setItem("chokchok_dark", "1");
    } else {
      document.documentElement.removeAttribute("data-dark");
      localStorage.setItem("chokchok_dark", "0");
    }
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark((d) => !d) }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
