import type { SummaryData } from "../../types/reportDetail";
import SectionHeader from "../../components/ui/SectionHeader";
import SentenceBlock from "../../components/ui/SentenceBlock";

interface Props {
  summary: SummaryData;
}

export default function SummaryTab({ summary }: Props) {
  return (
    <div className="screen detail-panel">
      <SectionHeader label="요약" />
      <SentenceBlock text={summary.highlight} className="detail-summary-highlight" />
      <div className="section-label">감지 신호</div>
      <div className="detail-chips">
        {summary.chips.map((s, i) => (
          <span key={`${s}-${i}`} className="chip">{s}</span>
        ))}
      </div>
      <div className="section-label">연루 서비스</div>
      <div className="detail-service-tags">
        {summary.errorTags.map((t, i) => (
          <span key={`${t}-${i}`} className="tag tag--error">{t}</span>
        ))}
        {summary.neutralTags.map((t, i) => (
          <span key={`${t}-${i}`} className="tag tag--neutral">{t}</span>
        ))}
      </div>
    </div>
  );
}
