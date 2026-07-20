import type { DashboardData } from "../types/dashboard";
import { MOCK_REPORTS } from "./reports";
import { toLocalDateStr } from "../utils/dateUtils";

const _today = toLocalDateStr(new Date());

export const MOCK_DASHBOARD: DashboardData = {
  summary: {
    total:      MOCK_REPORTS.length,
    highCount:  MOCK_REPORTS.filter((r) => r.severity === "HIGH").length,
    todayCount: MOCK_REPORTS.filter((r) => r.time.startsWith(_today)).length,
  },
  recentReports: [...MOCK_REPORTS].sort((a, b) => b.time.localeCompare(a.time)).slice(0, 5),
};
