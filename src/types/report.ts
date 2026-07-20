import type { LucideIcon } from "lucide-react";
// import { AlertTriangle, CheckCircle2, Zap } from "lucide-react";

export type Severity = "HIGH" | "MID" | "LOW";
// export type ReportStatus = "hitl" | "resolved" | "auto";

export interface Report {
  id: number;
  severity: Severity;
  type: string;
  service: string;
  /** "YYYY-MM-DD HH:mm" */
  time: string;
  // status: ReportStatus;
  summary: string;
}

export interface SeverityMeta {
  label: string;
  bg: string;
  color: string;
  border: string;
}

export interface StatusMeta {
  label: string;
  bg: string;
  color: string;
  Icon: LucideIcon;
}

export const SEVERITY_META: Record<Severity, SeverityMeta> = {
  HIGH: { label: "HIGH", bg: "#ffedd5", color: "#c2410c", border: "#ea580c" },
  MID:  { label: "MID",  bg: "#fef3c7", color: "#b45309", border: "#d97706" },
  LOW:  { label: "LOW",  bg: "var(--chip-success)", color: "#16a34a", border: "#22c55e" },
};

// export const STATUS_META: Record<ReportStatus, StatusMeta> = {
//   hitl:     { label: "HITL 승인 대기",  bg: "var(--warn-surface)", color: "#f97316", Icon: AlertTriangle },
//   resolved: { label: "수동 복구 완료",  bg: "var(--ok-surface)",   color: "#16a34a", Icon: CheckCircle2  },
//   auto:     { label: "자동 처리 완료",  bg: "#dbeafe",             color: "#1d4ed8", Icon: Zap           },
// };

export const SEVERITY_ORDER: Record<Severity, number> = {
  HIGH: 0,
  MID:  1,
  LOW:  2,
};
