import { createContext, useContext, useState, type ReactNode } from "react";
import type { Severity } from "../types/report";
import { toLocalDateStr } from "../utils/dateUtils";

const DEFAULTS = {
  filter: "all" as "all" | Severity,
  sort: "latest" as "latest" | "severity",
  pageSize: 10,
  page: 1,
  search: "",
};

function initDateRange() {
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);
  return { from: toLocalDateStr(weekAgo), to: toLocalDateStr(today) };
}

interface ReportsFilterValue {
  filter: "all" | Severity;
  sort: "latest" | "severity";
  pageSize: number;
  page: number;
  from: string;
  to: string;
  search: string;
  setFilter: (v: "all" | Severity) => void;
  setSort: (v: "latest" | "severity") => void;
  setPageSize: (v: number) => void;
  setPage: (v: number) => void;
  setFrom: (v: string) => void;
  setTo: (v: string) => void;
  setSearch: (v: string) => void;
  resetFilters: () => void;
}

const ReportsFilterContext = createContext<ReportsFilterValue | null>(null);

// Reports <-> ReportDetail 이동에도 필터가 유지되도록, 두 라우트를 감싸는 상위에 상태를 둔다
export function ReportsFilterProvider({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState(DEFAULTS.filter);
  const [sort, setSort] = useState(DEFAULTS.sort);
  const [pageSize, setPageSize] = useState(DEFAULTS.pageSize);
  const [page, setPage] = useState(DEFAULTS.page);
  const [from, setFrom] = useState(() => initDateRange().from);
  const [to, setTo] = useState(() => initDateRange().to);
  const [search, setSearch] = useState(DEFAULTS.search);

  const resetFilters = () => {
    const range = initDateRange();
    setFilter(DEFAULTS.filter);
    setSort(DEFAULTS.sort);
    setPageSize(DEFAULTS.pageSize);
    setPage(DEFAULTS.page);
    setFrom(range.from);
    setTo(range.to);
    setSearch(DEFAULTS.search);
  };

  return (
    <ReportsFilterContext.Provider
      value={{ filter, sort, pageSize, page, from, to, search, setFilter, setSort, setPageSize, setPage, setFrom, setTo, setSearch, resetFilters }}
    >
      {children}
    </ReportsFilterContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useReportsFilter(): ReportsFilterValue {
  const ctx = useContext(ReportsFilterContext);
  if (!ctx) throw new Error("useReportsFilter must be used within ReportsFilterProvider");
  return ctx;
}
