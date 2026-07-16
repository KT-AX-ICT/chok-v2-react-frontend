import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { dark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label={dark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      style={{
        padding: compact ? "6px 11px" : "6px 14px",
        border: "1.5px solid var(--border)",
        borderRadius: 7,
        background: "var(--toggle-bg)",
        color: "var(--text1)",
        display: "inline-flex",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
