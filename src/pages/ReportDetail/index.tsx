import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { fetchReportView } from "../../api/reports";
import type { ApiErrorResponse } from "../../api/client";
import { SEVERITY_META } from "../../types/report";
import type { Report } from "../../types/report";
import type { ReportDetail } from "../../types/reportDetail";
import type { AgentTab } from "../../types/reportDetail";
import SectionHeader from "../../components/ui/SectionHeader";
import SummaryTab from "./SummaryTab";
import CauseTab from "./CauseTab";
import ImpactTab from "./ImpactTab";
import ActionTab from "./ActionTab";
// import AgentLogTab from "./AgentLogTab"; // 후순위 — 에이전트 로그 탭 비활성화
import NotFound from "./NotFound";
import "../../styles/pages/report-detail.css";

type Tab = "요약" | "원인" | "영향" | "조치";
const TABS: Tab[] = ["요약", "원인", "영향", "조치"];

export default function ReportDetail() {
  const nav = useNavigate();
  const { id } = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [detail, setDetail] = useState<ReportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [tab, setTab] = useState<Tab>("요약");
  const [agentTab, setAgentTab] = useState<AgentTab>("log");

  useEffect(() => {
    const numId = Number(id);
    if (isNaN(numId)) { nav("/app/reports", { replace: true }); return; }
    let ignore = false;
    fetchReportView(numId)
      .then((view) => {
        if (ignore) return;
        // 없는 id 또는 미완료(DONE 아님) id — mock 폴백은 undefined로 동일하게 표현
        if (!view) { setNotFound(true); return; }
        setReport(view.report);
        setDetail(view.detail);
      })
      .catch((err) => {
        if (ignore) return;
        // REPORT_NOT_FOUND 공통 에러(404 + error.code)만 NotFound로 연결 — 그 외 에러는 기존대로 목록으로 리다이렉트
        const code = axios.isAxiosError(err)
          ? (err.response?.data as ApiErrorResponse | undefined)?.error?.code
          : undefined;
        if (axios.isAxiosError(err) && err.response?.status === 404 && code === "REPORT_NOT_FOUND") {
          setNotFound(true);
        } else {
          nav("/app/reports", { replace: true });
        }
      })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [id, nav]);

  if (loading) {
    return <div className="screen detail-page" style={{ color: "var(--text3)", font: "14px system-ui" }}>로딩 중...</div>;
  }
  if (notFound) return <NotFound reportId={id} />;
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
        </div>
      </div>

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
      {/* {tab === "에이전트 로그" && <AgentLogTab agentLog={detail.agentLog} />} */}
    </div>
  );
}
