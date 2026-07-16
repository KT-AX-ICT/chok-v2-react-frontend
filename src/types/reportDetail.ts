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
  confidence: number;
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

// --- Viz: dependency graph (log + trace 기반) ---

export interface GraphNode {
  id: string;
  status: "ok" | "error" | "down";
}

export interface GraphEdge {
  from: string;
  to: string;
  isErrorPath: boolean;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// --- Viz: fault timeline (log + trace 분석 결과 기반 장애 이벤트) ---

export type FaultSource = "log" | "trace";

export interface FaultEvent {
  timestamp: string;       // "HH:mm" or "HH:mm:ss"
  service: string;
  source: FaultSource;     // 이벤트 출처: log 분석 | trace 분석
  severity: 1 | 2 | 3;    // 1=경미 2=심각 3=치명
  detail?: string;         // 오류 내용 요약 (선택)
  isDown?: boolean;        // 서비스 완전 다운 여부
}

export interface FaultTimeline {
  detectedAt: string | null; // 최초 감지 시각, null=미감지
  events: FaultEvent[];
}

export interface VizData {
  graph: GraphData;        // log + trace에서 도출된 서비스 의존성 그래프
  timeline: FaultTimeline; // log/trace timestamp 기반 장애 발생·전파 이벤트
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
  agentLog: AgentLogEntry[];
  viz: VizData;
}
