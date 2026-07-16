import { api } from "./client";
import { MOCK_REPORTS } from "../mock/reports";
import { MOCK_REPORT_DETAIL } from "../mock/reportDetail";
import { MOCK_DASHBOARD } from "../mock/dashboard";
import type { Report, Severity } from "../types/report";
import { SEVERITY_ORDER } from "../types/report";
import type { ReportDetail } from "../types/reportDetail";
import type { DashboardData } from "../types/dashboard";

interface RcaReport {
  id: number;
  scenario: string;
  faultType: string;
  rootCauseService: string;
  severity: string;   // "HIGH" | "MID" | "LOW" from Spring
  evidence: string;   // JSON string
  analyzedAt: string;
}

function severityMap(s: string): Severity {
  const m: Record<string, Severity> = { HIGH: "high", MID: "mid", LOW: "low" };
  return m[s.toUpperCase()] ?? "low";
}

function toReport(r: RcaReport): Report {
  const sev = severityMap(r.severity);
  return {
    id: r.id,
    severity: sev,
    type: r.faultType,
    service: r.rootCauseService,
    time: r.analyzedAt,
    status: sev === "high" ? "hitl" : "auto",
    summary: buildSummary(r),
  };
}

function buildSummary(r: RcaReport): string {
  try {
    const parsed: unknown = JSON.parse(r.evidence);
    if (!Array.isArray(parsed)) return `${r.faultType} @ ${r.rootCauseService}`;
    const result = parsed
      .filter((e): e is { type: string } => e !== null && typeof e === "object" && typeof (e as Record<string, unknown>).type === "string")
      .map((e) => e.type)
      .join(" · ");
    return result || `${r.faultType} @ ${r.rootCauseService}`;
  } catch {
    return `${r.faultType} @ ${r.rootCauseService}`;
  }
}

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

// Spring Page 포맷 — 목록 아이템 필드(RcaReport)는 화면 기준 가정,
// 래퍼(content/totalElements/totalPages/page)는 서버에서 받아옴.
interface ReportPage {
  content: RcaReport[];
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
    const { data } = await api.get<ReportPage>("/api/reports", { params });
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

// GET /api/reports/{id} 한 번으로 헤더 + 본문을 함께 조회한다.
// 단일 응답이 RcaReport 필드(헤더)와 ReportDetail 필드(본문)를 모두 담고 있다고 가정.
export async function fetchReportView(id: number): Promise<ReportView | undefined> {
  try {
    const { data } = await api.get<RcaReport & ReportDetail>(`/api/reports/${id}`);
    return { report: toReport(data), detail: data };
  } catch (err) {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const report = MOCK_REPORTS.find((r) => r.id === id);
      return report ? { report, detail: MOCK_REPORT_DETAIL } : undefined;
    }
    throw err;
  }
}

export async function fetchDashboard(): Promise<DashboardData> {
  try {
    const { data } = await api.get<DashboardData>("/api/dashboard");
    return data;
  } catch (err) {
    if (import.meta.env.VITE_USE_MOCK === "true") return MOCK_DASHBOARD;
    throw err;
  }
}

export interface AuthResult {
  token: string;
  email: string;
  name?: string;
}

export const MOCK_DEMO = {
  email: "demo@chokchok.com",
  password: "demo1234",
  name: "CHOKCHOKHAN",
} as const;

export async function login(email: string, password: string): Promise<AuthResult> {
  try {
    const { data } = await api.post<AuthResult>("/auth/login", { email, password });
    return data;
  } catch (err) {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      await new Promise((r) => setTimeout(r, 1600));
      return { token: "demo-token", email: MOCK_DEMO.email, name: MOCK_DEMO.name };
    }
    throw err;
  }
}
