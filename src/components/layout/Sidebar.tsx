import { NavLink } from "react-router-dom";
// TODO: 확장판 — 활성화 시 아래 주석 해제
// import { useNavigate } from "react-router-dom";
// import { LogOut } from "lucide-react";
// import { useAuth } from "../../context/AuthContext";
import { LayoutGrid, List } from "lucide-react";
import Logo from "../ui/Logo";
import "../../styles/components/sidebar.css";

const pipeline = ["LogRead", "FastAPI", "Spring"];

export default function Sidebar() {
  // TODO: 확장판 — 활성화 시 아래 주석 해제
  // const nav = useNavigate();
  // const { email, name, signOut } = useAuth();
  // const displayEmail = email ?? "admin@company.com";
  // const displayName = name || displayEmail.split("@")[0];
  // const avatar = displayName[0].toUpperCase();

  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        <Logo />
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

      <div className="sidebar__pipeline">
        <div className="sidebar__pipeline-label">파이프라인 상태</div>
        <div className="sidebar__pipeline-list">
          {pipeline.map((p) => (
            <div key={p} className="sidebar__pipeline-item">
              <span className="sidebar__pipeline-dot" />
              {p}
            </div>
          ))}
        </div>
      </div>

      {/* TODO: 확장판 — 로그인 활성화 시 아래 주석 해제
      <div className="sidebar__user">
        <div className="sidebar__avatar">{avatar}</div>
        <div className="sidebar__user-info">
          <div className="sidebar__user-name">{displayName}</div>
          <div className="sidebar__user-email">{displayEmail}</div>
        </div>
        <button
          onClick={() => { signOut(); nav("/"); }}
          aria-label="로그아웃"
          className="sidebar__logout"
        >
          <LogOut size={16} color="#94a3b8" />
        </button>
      </div> */}
    </div>
  );
}
