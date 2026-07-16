import type { ImpactMetric, AffectedService } from "../../types/reportDetail";
import SectionHeader from "../../components/ui/SectionHeader";

interface Props {
  metrics: ImpactMetric[];
  affected: AffectedService[];
}

export default function ImpactTab({ metrics, affected }: Props) {
  return (
    <div className="screen detail-panel">
      <SectionHeader label="영향" />
      <div className="detail-impact-metrics">
        {metrics.map((m) => (
          <div key={m.label} className="detail-impact-metric">
            <div className="detail-impact-metric__label">{m.label}</div>
            <div className="detail-impact-metric__value">{m.value}</div>
          </div>
        ))}
      </div>
      <table className="detail-impact-table">
        <thead>
          <tr>
            {["서비스명", "에러 수", "유형"].map((h) => (
              <th key={h} className="detail-impact-th">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {affected.map((row) => (
            <tr key={row.service} className="detail-impact-row">
              <td className="detail-impact-td detail-impact-td--service">{row.service}</td>
              <td className="detail-impact-td detail-impact-td--errors">{row.errors}</td>
              <td className="detail-impact-td detail-impact-td--type">{row.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
