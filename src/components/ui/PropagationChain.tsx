import { renderWithCode } from "./renderWithCode";

interface Props {
  text: string;
}

// "A → B → C" 형태 전파 경로를 단계별 타임라인으로 렌더링 — 근본 원인(문장형)과 구조 자체를 다르게 함
export default function PropagationChain({ text }: Props) {
  const steps = text.split(/\s*→\s*/).filter(Boolean);
  return (
    <div className="propagation-chain">
      {steps.map((step, i) => (
        <div key={i} className="propagation-chain__step">
          <div className="propagation-chain__marker">
            <span className="propagation-chain__dot" />
            {i < steps.length - 1 && <span className="propagation-chain__line" />}
          </div>
          <span className="propagation-chain__text">{renderWithCode(step)}</span>
        </div>
      ))}
    </div>
  );
}
