import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { AlertTriangle, Check, X } from "lucide-react"; // HITL UI — 주석 해제 후 사용
import { fetchReportView } from "../../api/reports";
import { SEVERITY_META } from "../../types/report";
import type { Report } from "../../types/report";
import type { ReportDetail } from "../../types/reportDetail";
import type { AgentTab } from "../../types/reportDetail";
// TODO: 시각화 탭 — 히트맵 재설계 후 주석 해제
// import VizTab from "./VizTab";
import SectionHeader from "../../components/ui/SectionHeader";
import SummaryTab from "./SummaryTab";
import CauseTab from "./CauseTab";
import ImpactTab from "./ImpactTab";
import ActionTab from "./ActionTab";
// import AgentLogTab from "./AgentLogTab"; // 후순위 — 에이전트 로그 탭 비활성화
// TODO: 404 에러 화면 — REPORT_NOT_FOUND API 연동 후 주석 해제 (현재는 목록으로 리다이렉트만 함)
// import NotFound from "./NotFound";
// import { validateHITLAction } from "../../utils/validateMessages";     // HITL
// import { handleHITLApprove, handleHITLReject } from "../../utils/eventHandlers"; // HITL
import "../../styles/pages/report-detail.css";

type Tab = "요약" | "원인" | "영향" | "조치";
// TODO: 시각화 탭 — 히트맵 재설계 후 "시각화" 추가
const TABS: Tab[] = ["요약", "원인", "영향", "조치"];

export default function ReportDetail() {
  const nav = useNavigate();
  const { id } = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [detail, setDetail] = useState<ReportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("요약");
  const [agentTab, setAgentTab] = useState<AgentTab>("log");

  useEffect(() => {
    const numId = Number(id);
    if (isNaN(numId)) { nav("/app/reports", { replace: true }); return; }
    let ignore = false;
    fetchReportView(numId)
      .then((view) => {
        if (ignore) return;
        if (!view) { nav("/app/reports", { replace: true }); return; }
        setReport(view.report);
        setDetail(view.detail);
      })
      .catch(() => { if (!ignore) nav("/app/reports", { replace: true }); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [id, nav]);

  if (loading) {
    return <div className="screen detail-page" style={{ color: "var(--text3)", font: "14px system-ui" }}>로딩 중...</div>;
  }
  if (!report || !detail) return null;

  const sev = SEVERITY_META[report.severity];

  return (
    <div className="screen detail-page">
      {/* 브레드크럼 */}
      <div className="detail-breadcrumb">
        <button type="button" onClick={() => nav("/app/reports")}>리포트 목록</button> &gt; 상세
      </div>

      {/* 헤더 */}
      <div>
        <div className="detail-header-meta">
          <span className="sev-badge" style={{ background: sev.bg, color: sev.color }}>{sev.label}</span>
          {/* 감지 시각 텍스트 — 주석 처리 유지
          <span className="detail-header-meta__timestamp">{report.time} KST 감지 · 분석 완료 {report.time.substring(11, 16)}</span>
          */}
        </div>
        <div className="detail-title-row">
          <h1 className="detail-title">[{report.type}] {report.service}</h1>
          <div className="detail-confidence">
            <span className="detail-confidence__label">confidence</span>
            <span
              className="detail-confidence__value"
              style={{ color: detail.rca.confidence >= 90 ? "#16a34a" : detail.rca.confidence >= 70 ? "#ea580c" : "#ef4444" }}
            >
              {detail.rca.confidence}%
            </span>
          </div>
        </div>
      </div>

      {/* TODO: HITL 패널 — 확장 방향 확정 후 주석 해제 및 API 연동
      {showHitl && (
        <div className="detail-hitl">
          ...승인/거절 UI...
        </div>
      )}
      */}

      {/* RCA 결론 블록 */}
      <div className="detail-rca">
        <SectionHeader label="종합 에이전트 RCA 결론" />
        <div className="detail-rca__body">
          <div className="detail-rca__row">
            <span className="detail-rca__key">근본 원인</span>
            <span className="detail-rca__rootcause">{detail.rca.rootCause}</span>
          </div>
          <div className="detail-rca__row">
            <span className="detail-rca__key">전파 경로</span>
            <span className="detail-rca__propagation">{detail.rca.propagation}</span>
          </div>
        </div>
      </div>

      {/* 탭 네비 */}
      <div className="detail-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`detail-tab${tab === t ? " detail-tab--active" : ""}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* 탭 패널 */}
      {tab === "요약"          && <SummaryTab summary={detail.summary} />}
      {tab === "원인"          && <CauseTab agentTab={agentTab} evidence={detail.evidence} onAgentTabChange={setAgentTab} />}
      {tab === "영향"          && <ImpactTab metrics={detail.impact.metrics} affected={detail.impact.affected} />}
      {tab === "조치"          && <ActionTab steps={detail.actions.steps} recovery={detail.actions.recovery} />}
      {/* TODO: 시각화 탭 — 히트맵 재설계 후 주석 해제
      {tab === "시각화" && <VizTab viz={detail.viz} />} */}
      {/* {tab === "에이전트 로그" && <AgentLogTab agentLog={detail.agentLog} />} */}
    </div>
  );
}
