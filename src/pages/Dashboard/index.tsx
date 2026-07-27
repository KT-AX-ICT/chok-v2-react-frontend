import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDashboard } from "../../api/reports";
import { SEVERITY_META } from "../../types/report";
import type { Report } from "../../types/report";
import type { DashboardData } from "../../types/dashboard";
import "../../styles/pages/dashboard.css";

export default function Dashboard() {
  const nav = useNavigate();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    fetchDashboard()
      .then((data) => { if (!ignore) setDashboard(data); })
      .catch(() => { if (!ignore) setDashboard(null); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);

  if (loading) {
    return <div className="screen dashboard-page" style={{ color: "var(--text3)", font: "14px system-ui" }}>로딩 중...</div>;
  }
  if (!dashboard) return null;

  const { summary, recentReports } = dashboard;
  const recent = recentReports;
  const goDetail = (r: Report) => nav(`/app/reports/${r.id}`);

  const kpiItems = [
    { label: "전체 리포트",    value: summary.total,      color: "var(--text1)" },
    { label: "HIGH 이상",      value: summary.highCount,  color: "var(--err-text)" },
    { label: "오늘 발생",      value: summary.todayCount, color: "var(--brand)" },
  ];

  return (
    <div className="screen dashboard-page">
      <div className="dashboard-page__title">대시보드</div>

      {/* KPI 카드 */}
      <div className="dashboard-kpi-grid">
        {kpiItems.map((k) => (
          <div key={k.label} className="dashboard-kpi-card">
            <div className="dashboard-kpi-card__label">{k.label}</div>
            <div className="dashboard-kpi-card__value" style={{ color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* 최근 리포트 */}
      <div className="dashboard-recent">
        <div className="dashboard-recent__header">
          <span className="dashboard-recent__title">최근 리포트 {recent.length}건</span>
          <button onClick={() => nav("/app/reports")} className="dashboard-recent__all">전체 보기 →</button>
        </div>
        {recent.map((r, i) => {
          const sev = SEVERITY_META[r.severity];
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => goDetail(r)}
              className="dashboard-report-row"
              style={{ borderBottom: i < recent.length - 1 ? "1px solid var(--border2)" : "none" }}
            >
              <span className="sev-badge" style={{ background: sev.bg, color: sev.color }}>{sev.label}</span>
              <span className="dashboard-report-row__type">{r.type} · {r.service}</span>
              <span className="dashboard-report-row__time">{r.time.substring(11)}</span>
            </button>
          );
        })}
        {recent.length === 0 && (
          <div style={{ padding: "16px 18px", font: "13px system-ui", color: "var(--text3)" }}>
            리포트가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
