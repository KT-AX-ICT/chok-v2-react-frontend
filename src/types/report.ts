export type Severity = "HIGH" | "MID" | "LOW";

export interface Report {
  id: number;
  severity: Severity;
  type: string;
  service: string;
  /** "YYYY-MM-DD HH:mm" */
  time: string;
  summary: string;
}

export interface SeverityMeta {
  label: string;
  bg: string;
  color: string;
  border: string;
}

export const SEVERITY_META: Record<Severity, SeverityMeta> = {
  HIGH: { label: "HIGH", bg: "var(--chip-error)", color: "var(--chip-error-text)", border: "#ef4444" },
  MID:  { label: "MID",  bg: "var(--chip-warn)", color: "var(--chip-warn-text)", border: "#d97706" },
  LOW:  { label: "LOW",  bg: "var(--chip-success)", color: "var(--chip-success-text)", border: "#22c55e" },
};

export const SEVERITY_ORDER: Record<Severity, number> = {
  HIGH: 0,
  MID:  1,
  LOW:  2,
};
