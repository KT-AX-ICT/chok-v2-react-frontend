import type { AgentLogEntry } from "../../types/reportDetail";
import SectionHeader from "../../components/ui/SectionHeader";

const AGENT_COLORS: Record<string, string> = {
  Orchestrator: "var(--brand)",
  "Log Agent": "#1d4ed8",
  "Metric Agent": "#7c3aed",
  "Trace Agent": "#0891b2",
};

interface Props {
  agentLog: AgentLogEntry[];
}

export default function AgentLogTab({ agentLog }: Props) {
  return (
    <div className="screen detail-panel">
      <SectionHeader label="에이전트 호출 로그 · 근거 출처" />
      <div className="detail-agent-log">
        {agentLog.map((entry, i) => (
          <div
            key={i}
            className="detail-agent-log__row"
            style={{ borderBottom: i < agentLog.length - 1 ? "1px solid var(--border2)" : "none" }}
          >
            <span className="detail-agent-log__time">{entry.time}</span>
            <span className="detail-agent-log__agent" style={{ color: AGENT_COLORS[entry.agent] ?? "var(--text1)" }}>
              {entry.agent}
            </span>
            <span className="detail-agent-log__action">{entry.action}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
