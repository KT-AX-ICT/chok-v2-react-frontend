import SectionHeader from "../../components/ui/SectionHeader";
import { renderWithCode } from "../../components/ui/renderWithCode";

interface Props {
  steps: string[];
  recovery: string;
}

export default function ActionTab({ steps, recovery }: Props) {
  return (
    <div className="screen detail-panel">
      <SectionHeader label="대응 방안" />
      <div className="detail-action-steps">
        {steps.map((step, i) => (
          <div key={i} className="detail-action-step">
            <span className="detail-action-step__num">{i + 1}</span>
            <span className="detail-action-step__text">{renderWithCode(step)}</span>
          </div>
        ))}
      </div>
      <div className="detail-action-recovery">{renderWithCode(recovery)}</div>
    </div>
  );
}
