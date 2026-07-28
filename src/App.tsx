import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import RequireAuth from "./components/layout/RequireAuth";
import AppShell from "./components/layout/AppShell";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import ReportDetail from "./pages/ReportDetail";
import NotFound from "./pages/NotFound";
import { ReportsFilterProvider } from "./context/ReportsFilterContext";

export default function App() {
  return (
    <Routes>
      {/* 루트는 대시보드로, 미인증이면 RequireAuth가 /login으로 */}
      <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      {/* /app 하위 전체에 인증 게이트 + 사이드바 셸 공용 적용 */}
      <Route path="/app" element={<RequireAuth><AppShell /></RequireAuth>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        {/* 목록<->상세 이동에도 필터 유지되도록 ReportsFilterProvider로 묶음 */}
        <Route element={<ReportsFilterProvider><Outlet /></ReportsFilterProvider>}>
          <Route path="reports" element={<Reports />} />
          <Route path="reports/:id" element={<ReportDetail />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
      {/* 최상위 미정의 경로도 /app/404로 보내 인증 후 셸 안 404로 귀결시킴 */}
      <Route path="*" element={<Navigate to="/app/404" replace />} />
    </Routes>
  );
}
