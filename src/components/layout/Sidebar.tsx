import { NavLink, useNavigate } from "react-router-dom";
import { LayoutGrid, List, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Logo from "../ui/Logo";
import ThemeToggle from "../ui/ThemeToggle";
import { useAuth } from "../../context/AuthContext";
import "../../styles/components/sidebar.css";

export default function Sidebar() {
  const nav = useNavigate();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const displayName = user?.name ?? "사용자";
  const avatar = displayName[0]?.toUpperCase() ?? "U";

  useEffect(() => {
    if (!menuOpen) return;
    // 팝오버 바깥을 클릭하면 닫는다
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

  // replace: true — 로그아웃 후 뒤로가기로 인증된 화면에 재진입하지 못하게 히스토리를 대체
  const handleLogout = () => { setMenuOpen(false); signOut(); nav("/login", { replace: true }); };

  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        <Logo onClick={() => nav("/app/dashboard")} />
      </div>

      <nav className="sidebar__nav">
        <NavLink
          to="/app/dashboard"
          end
          className={({ isActive }) => `sidebar__nav-item${isActive ? " sidebar__nav-item--active" : ""}`}
        >
          <LayoutGrid size={15} />
          대시보드
        </NavLink>
        <NavLink
          to="/app/reports"
          className={({ isActive }) => `sidebar__nav-item${isActive ? " sidebar__nav-item--active" : ""}`}
        >
          <List size={15} />
          리포트 목록
        </NavLink>
      </nav>

      <div className="sidebar__user" ref={menuRef}>
        <div className="sidebar__user-row">
          <button
            type="button"
            className="sidebar__user-trigger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <div className="sidebar__avatar">{avatar}</div>
            <div className="sidebar__user-info">
              <div className="sidebar__user-name">{displayName}</div>
            </div>
          </button>
          <ThemeToggle compact />
        </div>

        {menuOpen && (
          <div className="sidebar__account-menu" role="menu">
            <div className="sidebar__account-menu-row">
              <span className="sidebar__account-menu-label">이메일</span>
              <span className="sidebar__account-menu-value">{user?.email ?? "-"}</span>
            </div>
            <div className="sidebar__account-menu-row">
              <span className="sidebar__account-menu-label">소속 기업</span>
              <span className="sidebar__account-menu-value">{user?.companyName ?? "-"}</span>
            </div>
            <div className="sidebar__account-menu-row">
              <span className="sidebar__account-menu-label">기업 코드</span>
              <span className="sidebar__account-menu-value">{user?.companyCode ?? "-"}</span>
            </div>
            <button type="button" onClick={handleLogout} className="sidebar__account-menu-logout" role="menuitem">
              <LogOut size={14} />
              로그아웃
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
