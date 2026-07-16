import type { Severity } from "../types/report";

/* ── Reports 페이지 ── */

export function handleSeverityFilter(
  value: "all" | Severity,
  setFilter: (v: "all" | Severity) => void,
  setPage: (p: number) => void,
) {
  setFilter(value);
  setPage(1);
}

export function handleSearch(
  value: string,
  setSearch: (v: string) => void,
  setPage: (p: number) => void,
) {
  setSearch(value);
  setPage(1);
}

export function handleSort(
  value: "latest" | "severity",
  setSort: (v: "latest" | "severity") => void,
  setPage: (p: number) => void,
) {
  setSort(value);
  setPage(1);
}

/* ── ReportDetail 페이지 ── */

// TODO: 확장판 — HITL 활성화 시 주석 해제
// export function handleHITLApprove(comment: string, onSuccess: () => void) {
//   // POST /api/rca/hitl/approve
//   console.log("HITL 승인:", comment);
//   onSuccess();
// }
// export function handleHITLReject(comment: string, onSuccess: () => void) {
//   // POST /api/rca/hitl/reject
//   console.log("HITL 거절:", comment);
//   onSuccess();
// }
