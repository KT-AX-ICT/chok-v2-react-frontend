import type { AgentTab, EvidenceData } from "../../types/reportDetail";
import SectionHeader from "../../components/ui/SectionHeader";
import SentenceBlock from "../../components/ui/SentenceBlock";

const AGENT_LABELS: Record<AgentTab, string> = {
  log:    "Log Agent",
  trace:  "Trace Agent",
  metric: "Metric Agent",
};

const LOG_LEVEL_CLASS: Record<string, string> = {
  FATAL: "detail-snapshot__line detail-snapshot__line--error",
  ERROR: "detail-snapshot__line detail-snapshot__line--warn",
  WARN:  "detail-snapshot__line detail-snapshot__line--warn",
  INFO:  "detail-snapshot__line",
};

const SPAN_STATUS_CLASS: Record<string, string> = {
  timeout: "detail-snapshot__line detail-snapshot__line--warn",
  error:   "detail-snapshot__line detail-snapshot__line--warn",
  no_span: "detail-snapshot__line detail-snapshot__line--error",
  ok:      "detail-snapshot__line",
};

interface Props {
  agentTab: AgentTab;
  evidence: EvidenceData;
  onAgentTabChange: (t: AgentTab) => void;
}

export default function CauseTab({ agentTab, evidence, onAgentTabChange }: Props) {
  return (
    <div className="screen detail-panel">
      <SectionHeader label="서브에이전트 근거" />
      <div className="detail-sub-tabs" role="tablist">
        {(["log", "trace", "metric"] as AgentTab[]).map((a) => (
          <button
            key={a}
            type="button"
            role="tab"
            aria-selected={agentTab === a}
            onClick={() => onAgentTabChange(a)}
            className={`detail-sub-tab${agentTab === a ? " detail-sub-tab--active" : ""}`}
          >
            {AGENT_LABELS[a]}
          </button>
        ))}
      </div>

      {agentTab === "log" && (
        <>
          <div className="detail-cause-items">
            <div className="detail-cause-item">
              <span className="detail-cause-item__label">출처</span>
              <span className="detail-cause-item__value">{evidence.log.source}</span>
            </div>
            <div className="detail-cause-item">
              <span className="detail-cause-item__label">분석 결론</span>
              <SentenceBlock text={evidence.log.conclusion} className="detail-cause-item__value detail-cause-item__value--conclusion" />
            </div>
          </div>
          <div className="detail-snapshot-label">로그</div>
          <div className="detail-snapshot">
            {evidence.log.lines.map((line, i) => (
              <div key={i} className={LOG_LEVEL_CLASS[line.level] ?? "detail-snapshot__line"}>
                <span style={{ opacity: 0.55 }}>{line.timestamp}</span>{"  "}
                <span style={{ fontWeight: 700 }}>[{line.level}]</span>{"  "}
                {line.msg}
              </div>
            ))}
          </div>
        </>
      )}

      {agentTab === "trace" && (
        <>
          <div className="detail-cause-items">
            <div className="detail-cause-item">
              <span className="detail-cause-item__label">출처</span>
              <span className="detail-cause-item__value">{evidence.trace.source}</span>
            </div>
            <div className="detail-cause-item">
              <span className="detail-cause-item__label">분석 결론</span>
              <SentenceBlock text={evidence.trace.conclusion} className="detail-cause-item__value detail-cause-item__value--conclusion" />
            </div>
          </div>
          <div className="detail-snapshot-label">트레이스</div>
          <div className="detail-snapshot">
            {evidence.trace.spans.map((span, i) => (
              <div key={i} className={SPAN_STATUS_CLASS[span.status] ?? "detail-snapshot__line"}>
                <span style={{ opacity: 0.5 }}>{span.traceId}</span>{"  "}
                <span>{span.from}→ {span.to}</span>{"  "}
                <span>{span.duration}</span>{"  "}
                <span style={{ fontWeight: 700 }}>{span.status.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {agentTab === "metric" && (
        <>
          <div className="detail-cause-items">
            <div className="detail-cause-item">
              <span className="detail-cause-item__label">출처</span>
              <span className="detail-cause-item__value">{evidence.metric.source}</span>
            </div>
            <div className="detail-cause-item">
              <span className="detail-cause-item__label">분석 결론</span>
              <SentenceBlock text={evidence.metric.conclusion} className="detail-cause-item__value detail-cause-item__value--conclusion" />
            </div>
          </div>
          <div className="detail-snapshot-label">스냅샷</div>
          <div className="detail-snapshot">
            {evidence.metric.items.map((item, i) => (
              <div key={i} className={item.exceeded ? "detail-snapshot__line detail-snapshot__line--warn" : "detail-snapshot__line"}>
                {item.label}: {item.value}{item.threshold ? ` (임계치 ${item.threshold})` : ""}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
