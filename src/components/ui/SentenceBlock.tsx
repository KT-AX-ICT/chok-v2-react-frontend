import { splitSentences } from "../../utils/textUtils";
import { renderWithCode } from "./renderWithCode";

interface Props {
  text: string;
  className?: string;
}

// 문장마다 별도 블록으로 렌더링 — 줄바꿈 문자 대신 실제 margin으로 문장 간 리듬을 준다
// 문장 내 `...` 구간은 인라인 코드로 하이라이팅
export default function SentenceBlock({ text, className }: Props) {
  return (
    <div className={className}>
      {splitSentences(text).map((sentence, i) => (
        <p key={i} className="sentence-block__line">{renderWithCode(sentence)}</p>
      ))}
    </div>
  );
}
