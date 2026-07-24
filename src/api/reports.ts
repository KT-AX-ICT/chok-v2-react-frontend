import { api } from "./client";
import { MOCK_REPORTS } from "../mock/reports";
import { MOCK_REPORT_DETAIL } from "../mock/reportDetail";
import { MOCK_DASHBOARD } from "../mock/dashboard";
import type { Report, Severity } from "../types/report";
import { SEVERITY_ORDER } from "../types/report";
import type { ReportDetail, EvidenceData } from "../types/reportDetail";
import type { DashboardData, DashboardSummary } from "../types/dashboard";
import { utcToKst } from "../utils/dateUtils";

// Spring ReportListItem (api-spec §2, web/dto/ReportListItem.java) — Reports 목록 · Dashboard recentReports 공용.
// type·service·severity는 분석/판정 전이면 null (백엔드 원천 미확정, Q-007).
interface ReportListItem {
  id: number;
  type: string | null;
  service: string | null;
  severity: string | null; // "HIGH" | "MID" | "LOW" | null
  summary: string | null;
  detectedAt: string | null; // UTC "yyyy-MM-dd HH:mm:ss"
  createdAt: string;
}

function severityMap(s: string | null): Severity {
  if (!s) return "LOW";
  const m: Record<string, Severity> = { HIGH: "HIGH", MID: "MID", LOW: "LOW" };
  return m[s] ?? "LOW";
}

function toReport(r: ReportListItem): Report {
  const sev = severityMap(r.severity);
  return {
    id: r.id,
    severity: sev,
    type: r.type ?? "-",
    service: r.service ?? "-",
    time: utcToKst(r.detectedAt ?? r.createdAt), // 백엔드는 UTC로 내려줌 — 화면 표시는 KST
    summary: r.summary ?? "",
  };
}

// 백엔드 Pageable sort 포맷("field,direction", 화이트리스트: createdAt·severity·detectedAt)에 맞춘 매핑.
// "latest"는 화이트리스트에 없는 값이라 그대로 보내면 서버가 조용히 기본값(createdAt desc)으로 폴백한다.
const SORT_PARAM: Record<NonNullable<FetchReportsParams["sort"]>, string> = {
  latest: "createdAt,desc",
  severity: "severity,asc",
};

export interface FetchReportsParams {
  page?: number;
  size?: number;
  severity?: Severity;
  from?: string;
  to?: string;
  search?: string;
  sort?: "latest" | "severity";
}

export interface FetchReportsResult {
  items: Report[];
  total: number;
}

// Spring Page 포맷 (web/dto/PageResponse.java) — content는 ReportListItem[].
interface ReportPage {
  content: ReportListItem[];
  totalElements: number;
  totalPages: number;
  page: number;
}

// mock 폴백도 실제 API처럼 severity/from/to/search/sort/page/size를 전부 반영해서
// 응답한다 — 그래야 나중에 실 API로 교체할 때 Reports 화면 쪽 코드를 다시 안 건드려도 됨.
function queryMockReports(params?: FetchReportsParams): FetchReportsResult {
  let list = MOCK_REPORTS;
  if (params?.severity) list = list.filter((r) => r.severity === params.severity);
  if (params?.from) list = list.filter((r) => r.time.substring(0, 10) >= params.from!);
  if (params?.to) list = list.filter((r) => r.time.substring(0, 10) <= params.to!);
  if (params?.search) {
    const q = params.search.toLowerCase();
    list = list.filter((r) => r.service.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q));
  }
  list = [...list].sort((a, b) =>
    params?.sort === "severity"
      ? SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
      : b.time.localeCompare(a.time)
  );

  const total = list.length;
  const page = params?.page ?? 0;
  const size = params?.size ?? 20;
  const start = page * size;
  return { items: list.slice(start, start + size), total };
}

export async function fetchReports(params?: FetchReportsParams): Promise<FetchReportsResult> {
  try {
    // 서버는 Spring Page 포맷({ content, totalElements, ... })으로 응답 — 총 건수는 totalElements를 씀
    const { data } = await api.get<ReportPage>("/api/reports", {
      params: {
        ...params,
        severity: params?.severity?.toUpperCase(), // 백엔드는 HIGH/MID/LOW 대문자로 저장·비교
        sort: params?.sort ? SORT_PARAM[params.sort] : undefined,
      },
    });
    const content = Array.isArray(data?.content) ? data.content : [];
    return { items: content.map(toReport), total: data?.totalElements ?? content.length };
  } catch (err) {
    if (import.meta.env.VITE_USE_MOCK === "true") return queryMockReports(params);
    throw err;
  }
}

export interface ReportView {
  report: Report;        // 헤더용 (심각도 뱃지·제목·시각 등)
  detail: ReportDetail;  // 탭 본문용 (rca·evidence·impact·actions 등)
}

// Spring ReportDetailResponse (web/dto/ReportDetailResponse.java) — {report, counts, detail} 3단 봉투.
// counts·windowStart/End·trigger_info는 응답엔 있지만 화면이 안 써서 타입에서 제외.
// detail은 result JSON 패스스루 — 내부 필드가 api-spec §2상 optional(LLM 미충족 시 생략)이라 Partial로 받는다.
interface ReportDetailEnvelope {
  report: ReportListItem;
  detail: Partial<ReportDetail> | null;
}

// detail 정규화 — 백엔드가 optional 필드를 생략해도 화면(탭 컴포넌트)이 방어 없이 .map 하므로,
// 경계에서 누락 배열·객체를 기본값으로 채워 크래시를 막는다. (api-spec §2 "프론트는 생략 렌더")
function normalizeDetail(d: Partial<ReportDetail> | null | undefined): ReportDetail {
  const ev = (d?.evidence ?? {}) as Partial<EvidenceData>;
  return {
    rca: {
      rootCause: d?.rca?.rootCause ?? "",
      propagation: d?.rca?.propagation ?? "",
    },
    summary: {
      highlight: d?.summary?.highlight ?? "",
      chips: d?.summary?.chips ?? [],
      errorTags: d?.summary?.errorTags ?? [],
      neutralTags: d?.summary?.neutralTags ?? [],
    },
    evidence: {
      log:    { source: ev.log?.source ?? "",    conclusion: ev.log?.conclusion ?? "",    lines: ev.log?.lines ?? [] },
      trace:  { source: ev.trace?.source ?? "",  conclusion: ev.trace?.conclusion ?? "",  spans: ev.trace?.spans ?? [] },
      metric: { source: ev.metric?.source ?? "", conclusion: ev.metric?.conclusion ?? "", items: ev.metric?.items ?? [], snapshot: ev.metric?.snapshot ?? [] },
    },
    impact: {
      metrics: d?.impact?.metrics ?? [],
      affected: d?.impact?.affected ?? [],
    },
    actions: {
      steps: d?.actions?.steps ?? [],
      recovery: d?.actions?.recovery ?? "",
    },
  };
}

// GET /api/reports/{id} — {report, counts, detail} 봉투를 벗겨 헤더(report)/본문(detail)으로 분리.
export async function fetchReportView(id: number): Promise<ReportView | undefined> {
  try {
    const { data } = await api.get<ReportDetailEnvelope>(`/api/reports/${id}`);
    return { report: toReport(data.report), detail: normalizeDetail(data.detail) };
  } catch (err) {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const report = MOCK_REPORTS.find((r) => r.id === id);
      return report ? { report, detail: MOCK_REPORT_DETAIL } : undefined;
    }
    throw err;
  }
}

// Spring DashboardResponse — summary는 DashboardSummary와 동일 모양, recentReports만 화면과 다름(ReportListItem).
interface DashboardResponseDto {
  summary: DashboardSummary;
  recentReports: ReportListItem[];
}

export async function fetchDashboard(): Promise<DashboardData> {
  try {
    const { data } = await api.get<DashboardResponseDto>("/api/dashboard");
    return { summary: data.summary, recentReports: data.recentReports.map(toReport) };
  } catch (err) {
    if (import.meta.env.VITE_USE_MOCK === "true") return MOCK_DASHBOARD;
    throw err;
  }
}
