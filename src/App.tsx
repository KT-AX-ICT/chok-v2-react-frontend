import { Navigate, Route, Routes } from "react-router-dom";
// TODO: 확장판 — 활성화 시 아래 주석 해제
// import Landing from "./pages/Landing";
// import Login from "./pages/Login";
// import RequireAuth from "./components/layout/RequireAuth";
import AppShell from "./components/layout/AppShell";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import ReportDetail from "./pages/ReportDetail";

export default function App() {
  return (
    <Routes>
      {/* TODO: 확장판 — 활성화 시 아래 주석 해제
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} /> */}
      <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/app" element={<AppShell />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="reports" element={<Reports />} />
        <Route path="reports/:id" element={<ReportDetail />} />
      </Route>
      <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
    </Routes>
  );
}
