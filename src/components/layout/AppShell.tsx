import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppShell() {
  return (
    <div className="screen" style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <div style={{ flex: 1, overflowY: "auto", background: "var(--bg2)", display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header />
        <Outlet />
      </div>
    </div>
  );
}
