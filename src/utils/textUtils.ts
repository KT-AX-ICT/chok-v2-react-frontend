// "~다." 뒤에서 문장 단위로 분리
export function splitSentences(text: string): string[] {
  return text.split(/(?<=다\.)\s*/g).filter(Boolean);
}

export interface TextSegment {
  text: string;
  code: boolean;
  /** 문장형(공백 있음) vs 토큰(공백 없음) */
  kind?: "message" | "token";
}

// 백틱 구간을 코드 세그먼트로 분리
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
