import { splitByBacktick } from "../../utils/textUtils";

// `...` 구간을 인라인 코드로 렌더링 — message(문장형)/token(식별자) 성격별로 색 다르게
export function renderWithCode(text: string) {
  return splitByBacktick(text).map((seg, i) =>
    seg.code
      ? <code key={i} className={`inline-code inline-code--${seg.kind}`}>{seg.text}</code>
      : seg.text
  );
}
