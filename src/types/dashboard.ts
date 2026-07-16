import type { Report } from "./report";

export interface DashboardSummary {
  total: number;
  highCount: number;
  hitlCount: number;
  todayCount: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  recentReports: Report[];
}
