import { splitByBacktick } from "../../utils/textUtils";

// 백틱 구간을 성격별 색상의 인라인 코드로 렌더링
export function renderWithCode(text: string) {
  return splitByBacktick(text).map((seg, i) =>
    seg.code
      ? <code key={i} className={`inline-code inline-code--${seg.kind}`}>{seg.text}</code>
      : seg.text
  );
}
