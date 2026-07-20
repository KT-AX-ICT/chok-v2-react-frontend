import type { Report } from "./report";

// Spring DashboardResponse.Summary(total/highCount/todayCount 3필드) — hitlCount는 백엔드가 보내지 않음
export interface DashboardSummary {
  total: number;
  highCount: number;
  todayCount: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  recentReports: Report[];
}
