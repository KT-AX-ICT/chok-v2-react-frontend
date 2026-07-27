import { splitSentences } from "../../utils/textUtils";
import { renderWithCode } from "./renderWithCode";

interface Props {
  text: string;
  className?: string;
}

// 문장 단위로 블록 분리 + 백틱 구간 하이라이팅
export default function SentenceBlock({ text, className }: Props) {
  return (
    <div className={className}>
      {splitSentences(text).map((sentence, i) => (
        <p key={i} className="sentence-block__line">{renderWithCode(sentence)}</p>
      ))}
    </div>
  );
}
