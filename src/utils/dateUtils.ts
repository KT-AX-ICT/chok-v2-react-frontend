export function toLocalDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * 백엔드가 UTC로 내려주는 "yyyy-MM-dd HH:mm:ss" 문자열을 KST(+9h) 같은 포맷으로 변환.
 * (api-spec: 저장·전송은 UTC 고정, 표시 시각대 변환은 프론트 몫)
 */
export function utcToKst(utc: string): string {
  const m = utc.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
  if (!m) return utc;
  const [y, mo, d, h, mi, s] = m.slice(1).map(Number);
  const kst = new Date(Date.UTC(y, mo - 1, d, h, mi, s) + 9 * 60 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${kst.getUTCFullYear()}-${pad(kst.getUTCMonth() + 1)}-${pad(kst.getUTCDate())} ${pad(kst.getUTCHours())}:${pad(kst.getUTCMinutes())}:${pad(kst.getUTCSeconds())}`;
}
