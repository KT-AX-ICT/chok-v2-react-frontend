import type { ReportDetail } from "../types/reportDetail";
import { toLocalDateStr } from "../utils/dateUtils";

export type { AgentTab } from "../types/reportDetail";

const _today = toLocalDateStr(new Date());

export const MOCK_REPORT_DETAIL: ReportDetail = {
  rca: {
    rootCause: "media-service 프로세스가 내부 연결 오류로 인해 강제 종료(Code_Stop)됨",
    propagation: "media-service → compose-post 연결 실패 (200건) → nginx-thrift 5xx 응답 증가 (200건)",
    confidence: 94,
  },
  summary: {
    highlight: "media-service 코드 실행 정지로 ComposePost 요청 200건 실패, NginxThrift 5xx 200건 발생. 자동 복구 없음.",
    chips: ["Log: 로그파일 없음", "Log: 연결실패 200건", "Trace: span 소실"],
    errorTags: ["media-service"],
    neutralTags: ["compose-post", "nginx"],
  },
  evidence: {
    log: {
      source: "ELK Stack",
      conclusion: "media-service 로그 파일 없음 → Code_Stop 확정",
      lines: [
        { timestamp: `${_today} 11:31:58`, level: "INFO",  msg: "media-service starting..." },
        { timestamp: `${_today} 12:00:01`, level: "ERROR", msg: "Failed to connect media-service-client: Connection refused" },
        { timestamp: `${_today} 12:00:01`, level: "ERROR", msg: "Failed to connect media-service-client: Connection refused" },
        { timestamp: `${_today} 12:00:15`, level: "FATAL", msg: "Process terminated unexpectedly" },
      ],
    },
    trace: {
      source: "Jaeger",
      conclusion: "media-service span 완전 소실 → 다운스트림 타임아웃 전파 확인",
      spans: [
        { traceId: "a1b2", from: "nginx-thrift", to: "compose-post",  duration: "12ms",   status: "ok" },
        { traceId: "a1b2", from: "compose-post", to: "media-service", duration: "1240ms", status: "timeout" },
        { traceId: "a1b3", from: "nginx-thrift", to: "compose-post",  duration: "11ms",   status: "ok" },
        { traceId: "a1b3", from: "compose-post", to: "media-service", duration: "--",     status: "no_span" },
      ],
    },
    metric: {
      source: "Prometheus",
      conclusion: "장애 직전 CPU 스파이크 → 프로세스 강제 종료 패턴 확인",
      items: [
        { label: "CPU 사용률", value: "99.8%", threshold: "90%", exceeded: true },
        { label: "메모리",     value: "1.9 GB / 2.0 GB" },
        { label: "요청 처리량", value: "12:00 이후 0 req/s" },
      ],
      snapshot: [
        "11:58  cpu=42%  mem=1.1GB  req=320/s",
        "11:59  cpu=78%  mem=1.7GB  req=290/s",
        "12:00  cpu=99%  mem=1.9GB  req=210/s  ← 스파이크",
        "12:00  cpu=--   mem=--     req=0/s    ← 프로세스 종료",
      ],
    },
  },
  impact: {
    metrics: [
      { label: "NginxThrift 5xx", value: "200건" },
      { label: "영향 서비스",     value: "2개" },
      { label: "지속 시간",       value: "23분" },
    ],
    affected: [
      { service: "compose-post", errors: 200, type: "연결 실패" },
      { service: "nginx-thrift", errors: 200, type: "HTTP 5xx" },
    ],
  },
  actions: {
    steps: [
      "media-service 컨테이너 재기동",
      "ComposePost 에러 해소 확인",
      "NginxThrift 5xx 0건 복귀 확인",
    ],
    recovery: "예상 복구: 수동 복구 필요 (자동 복구 없음)",
  },
  viz: {
    graph: {
      nodes: [
        { id: "nginx-thrift",  status: "ok" },
        { id: "compose-post",  status: "error" },
        { id: "media-service", status: "down" },
        { id: "user-service",  status: "ok" },
        { id: "text-service",  status: "ok" },
      ],
      edges: [
        { from: "nginx-thrift",  to: "compose-post",  isErrorPath: false },
        { from: "compose-post",  to: "media-service", isErrorPath: true },
        { from: "compose-post",  to: "user-service",  isErrorPath: false },
        { from: "compose-post",  to: "text-service",  isErrorPath: false },
      ],
    },
    timeline: {
      detectedAt: "14:32",
      events: [
        // ── media-service: 프로세스 강제 종료 (log)
        { timestamp: "14:28", service: "media-service", source: "log",   severity: 3, detail: "Process terminated unexpectedly", isDown: true },
        { timestamp: "14:35", service: "media-service", source: "log",   severity: 3, detail: "Connection refused (×200)",        isDown: true },
        { timestamp: "14:55", service: "media-service", source: "log",   severity: 3, detail: "미복구 — 수동 재기동 필요",           isDown: true },
        // ── compose-post: media-service 연결 실패 (trace)
        { timestamp: "14:32", service: "compose-post",  source: "trace", severity: 2, detail: "media-service 타임아웃 (1240ms)" },
        { timestamp: "14:35", service: "compose-post",  source: "trace", severity: 2, detail: "media-service span 소실" },
        { timestamp: "14:40", service: "compose-post",  source: "trace", severity: 2, detail: "요청 큐 적체" },
        { timestamp: "14:47", service: "compose-post",  source: "trace", severity: 1, detail: "부분 복구 — 요청 재시도 진행 중" },
        // ── nginx-thrift: 다운스트림 5xx 전파 (log)
        { timestamp: "14:32", service: "nginx-thrift",  source: "log",   severity: 1, detail: "HTTP 5xx 응답 시작" },
        { timestamp: "14:35", service: "nginx-thrift",  source: "log",   severity: 2, detail: "5xx 급증 — compose-post 전파" },
        { timestamp: "14:40", service: "nginx-thrift",  source: "log",   severity: 2, detail: "5xx 지속" },
        { timestamp: "14:47", service: "nginx-thrift",  source: "log",   severity: 1, detail: "5xx 감소" },
      ],
    },
  },
  agentLog: [
    { time: "12:00:05", agent: "Orchestrator", action: "장애 감지 — severity=high, 멀티에이전트 분석 시작" },
    { time: "12:00:06", agent: "Log Agent",    action: "media-service 로그 수집 시작 (최근 30분)" },
    { time: "12:00:07", agent: "Metric Agent", action: "CPU·메모리·요청량 스냅샷 수집" },
    { time: "12:00:07", agent: "Trace Agent",  action: "11:58–12:05 구간 분산 추적 수집" },
    { time: "12:00:11", agent: "Log Agent",    action: "결론 반환 — Code_Stop 확정, 근거 3건" },
    { time: "12:00:13", agent: "Metric Agent", action: "결론 반환 — CPU 스파이크 패턴 확인, 근거 2건" },
    { time: "12:00:14", agent: "Trace Agent",  action: "결론 반환 — span 소실 + 전파 경로 확인, 근거 4건" },
    { time: "12:00:15", agent: "Orchestrator", action: "RCA 종합 — confidence 94%, 대응 방안 생성 완료" },
  ],
};
