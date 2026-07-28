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
      {/* 루트 진입은 항상 대시보드로: 미인증이면 아래 RequireAuth가 다시 /login으로 보낸다 */}
      <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      {/* /app 하위 전체를 RequireAuth로 감싸 인증 게이트 + 사이드바 셸을 공용 적용 */}
      <Route path="/app" element={<RequireAuth><AppShell /></RequireAuth>}>
        {/* /app 정확히 매치 시(하위 경로 없이) 대시보드로 보정 */}
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        {/* 목록<->상세 이동에도 필터 유지되도록 두 라우트를 ReportsFilterProvider로 묶는다 */}
        <Route element={<ReportsFilterProvider><Outlet /></ReportsFilterProvider>}>
          <Route path="reports" element={<Reports />} />
          <Route path="reports/:id" element={<ReportDetail />} />
        </Route>
        {/* /app 하위 미정의 경로는 전부 여기로: 인증된 사용자는 사이드바 있는 셸 안에서 404를 본다 */}
        <Route path="*" element={<NotFound />} />
      </Route>
      {/*
        최상위 미정의 경로도 위 캐치올을 타도록 "/app/404"(실제 페이지 아님, 표식용 경로)로 보낸다.
        RequireAuth를 통과해야 하므로 미인증이면 /login, 인증돼 있으면 셸 안 404로 귀결된다.
      */}
      <Route path="*" element={<Navigate to="/app/404" replace />} />
    </Routes>
  );
}
