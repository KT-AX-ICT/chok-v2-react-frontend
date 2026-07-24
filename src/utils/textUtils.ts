// "~다." 뒤에서 문장을 끊어 배열로 반환 — LLM이 쓴 긴 문단을 문장 단위 블록으로 렌더링할 때 씀
export function splitSentences(text: string): string[] {
  return text.split(/(?<=다\.)\s*/g).filter(Boolean);
}

export interface TextSegment {
  text: string;
  code: boolean;
  /** code일 때만: 공백 있는 문장형(에러 메시지)인지, 공백 없는 단일 토큰(식별자·경로)인지 */
  kind?: "message" | "token";
}

// `...`로 감싼 구간(에러 메시지·식별자 등)을 코드 구간으로 분리 — 렌더링 시 인라인 코드 스타일 적용용
export function splitByBacktick(text: string): TextSegment[] {
  return text
    .split(/(`[^`]+`)/g)
    .filter(Boolean)
    .map((part) => {
      if (part.startsWith("`") && part.endsWith("`") && part.length > 1) {
        const inner = part.slice(1, -1);
        const kind: "message" | "token" = inner.includes(" ") ? "message" : "token";
        return { text: inner, code: true, kind };
      }
      return { text: part, code: false };
    });
}
