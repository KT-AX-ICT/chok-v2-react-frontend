// 이메일: 형식 검사 + 12~30자 제한
export function validateLoginEmail(email: string): string | null {
  const v = email.trim();
  if (!v) return "이메일을 입력해 주세요.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "이메일 형식이 아닙니다.";
  if (v.length < 12 || v.length > 30) return "이메일은 12~30자로 입력해 주세요.";
  return null;
}

// 비밀번호: 8~15자, 영문(대소문자 무관)·숫자·!@# 만 허용, 각 1개 이상 필수(기타 특수문자 불가)
export function validateLoginPassword(pw: string): string | null {
  if (!pw) return "비밀번호를 입력해 주세요.";
  if (!/^[A-Za-z0-9!@#]{8,15}$/.test(pw)) return "8~15자, 영문 대/소문자·숫자·!@# 만 사용할 수 있습니다.";
  if (!/[A-Za-z]/.test(pw) || !/\d/.test(pw) || !/[!@#]/.test(pw)) {
    return "영문(대소문자 무관)·숫자·!@# 를 각각 1개 이상 포함해야 합니다.";
  }
  return null;
}
