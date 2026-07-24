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
