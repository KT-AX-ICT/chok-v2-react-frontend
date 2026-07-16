import type { SummaryData } from "../../types/reportDetail";
import SectionHeader from "../../components/ui/SectionHeader";

interface Props {
  summary: SummaryData;
}

export default function SummaryTab({ summary }: Props) {
  return (
    <div className="screen detail-panel">
      <SectionHeader label="요약" />
      <div className="detail-summary-highlight">{summary.highlight}</div>
      <div className="section-label">감지 신호</div>
      <div className="detail-chips">
        {summary.chips.map((s) => (
          <span key={s} className="chip">{s}</span>
        ))}
      </div>
      <div className="section-label">연루 서비스</div>
      <div className="detail-service-tags">
        {summary.errorTags.map((t) => (
          <span key={t} className="tag tag--error">{t}</span>
        ))}
        {summary.neutralTags.map((t) => (
          <span key={t} className="tag tag--neutral">{t}</span>
        ))}
      </div>
    </div>
  );
}
