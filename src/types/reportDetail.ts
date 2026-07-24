export type AgentTab = "log" | "trace" | "metric";

// --- Evidence (structured JSON from log/trace/metric agents) ---

export interface LogLine {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "FATAL";
  msg: string;
}

export interface LogEvidence {
  source: string;
  conclusion: string;
  lines: LogLine[];
}

export interface TraceSpan {
  traceId: string;
  from: string;
  to: string;
  duration: string;
  status: "ok" | "error" | "timeout" | "no_span";
}

export interface TraceEvidence {
  source: string;
  conclusion: string;
  spans: TraceSpan[];
}

export interface MetricItem {
  label: string;
  value: string;
  threshold?: string;
  exceeded?: boolean;
}

export interface MetricEvidence {
  source: string;
  conclusion: string;
  items: MetricItem[];
  snapshot: string[];
}

export interface EvidenceData {
  log: LogEvidence;
  trace: TraceEvidence;
  metric: MetricEvidence;
}

// --- Core types ---

export interface RcaData {
  rootCause: string;
  propagation: string;
}

export interface SummaryData {
  highlight: string;
  chips: string[];
  errorTags: string[];
  neutralTags: string[];
}

export interface ImpactMetric {
  label: string;
  value: string;
}

export interface AffectedService {
  service: string;
  errors: number;
  type: string;
}

export interface AgentLogEntry {
  time: string;
  agent: string;
  action: string;
}

// --- Top-level ---

export interface ReportDetail {
  rca: RcaData;
  summary: SummaryData;
  evidence: EvidenceData;
  impact: {
    metrics: ImpactMetric[];
    affected: AffectedService[];
  };
  actions: {
    steps: string[];
    recovery: string;
  };
  // Spring detail 계약(api-spec §2)은 rca/summary/evidence/impact/actions 5키뿐 —
  // agentLog는 후순위(AgentLogTab 비활성) 화면 계약이라 백엔드가 보내지 않는다.
  agentLog?: AgentLogEntry[];
}
