import type { Severity } from "../types/report";

/* ── Reports 페이지 ── setSearchParams 중복 호출 시 덮어써지는 문제 방지 위해 값+page를 한 번에 전달 */

export function handleSeverityFilter(
  value: "all" | Severity,
  update: (u: { filter: "all" | Severity; page: number }) => void,
) {
  update({ filter: value, page: 1 });
}

export function handleSearch(
  value: string,
  update: (u: { search: string; page: number }) => void,
) {
  update({ search: value, page: 1 });
}

export function handleSort(
  value: "latest" | "severity",
  update: (u: { sort: "latest" | "severity"; page: number }) => void,
) {
  update({ sort: value, page: 1 });
}
