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
  HIGH: { label: "HIGH", bg: "#ffedd5", color: "#c2410c", border: "#ea580c" },
  MID:  { label: "MID",  bg: "#fef3c7", color: "#b45309", border: "#d97706" },
  LOW:  { label: "LOW",  bg: "var(--chip-success)", color: "#16a34a", border: "#22c55e" },
};

export const SEVERITY_ORDER: Record<Severity, number> = {
  HIGH: 0,
  MID:  1,
  LOW:  2,
};
