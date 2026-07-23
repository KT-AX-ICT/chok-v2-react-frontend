// 12~30자 제한은 임의값이 아니라 프론트-백 합의된 검증 규칙(docs/superpowers/specs/2026-07-23-login-auth-design.md §3)
export function validateLoginEmail(email: string): string | null {
  const v = email.trim();
  if (!v) return "이메일을 입력해 주세요.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "이메일 형식이 아닙니다.";
  if (v.length < 12 || v.length > 30) return "이메일은 12~30자로 입력해 주세요.";
  return null;
}

// 기타 특수문자는 의도적으로 제외(영문 대/소문자 + 숫자 + !@# 만 허용) — 위 설계 문서 §3의 합의된 규칙
// 대문자/소문자는 구분하지 않음 — 영문(대소문자 무관) 1개 이상 + 숫자 1개 이상 + !@# 1개 이상만 요구
export function validateLoginPassword(pw: string): string | null {
  if (!pw) return "비밀번호를 입력해 주세요.";
  if (!/^[A-Za-z0-9!@#]{8,15}$/.test(pw)) return "8~15자, 영문 대/소문자·숫자·!@# 만 사용할 수 있습니다.";
  if (!/[A-Za-z]/.test(pw) || !/\d/.test(pw) || !/[!@#]/.test(pw)) {
    return "영문(대소문자 무관)·숫자·!@# 를 각각 1개 이상 포함해야 합니다.";
  }
  return null;
}

// TODO: 확장판 — 로그인·회원가입·HITL 활성화 시 주석 해제

// export function validateLogin(email: string, password: string): string | null {
//   if (!email.trim()) return "이메일을 입력해 주세요.";
//   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "올바른 이메일 형식이 아닙니다.";
//   if (!password) return "비밀번호를 입력해 주세요.";
//   if (password.length < 8) return "비밀번호는 8자 이상이어야 합니다.";
//   return null;
// }

// export function validateSignup(
//   name: string,
//   email: string,
//   password: string,
//   confirm: string,
// ): string | null {
//   if (!name.trim()) return "이름을 입력해 주세요.";
//   if (!email.trim()) return "이메일을 입력해 주세요.";
//   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "올바른 이메일 형식이 아닙니다.";
//   if (!password) return "비밀번호를 입력해 주세요.";
//   if (password.length < 8) return "비밀번호는 8자 이상이어야 합니다.";
//   if (!confirm) return "비밀번호 확인을 입력해 주세요.";
//   if (password !== confirm) return "비밀번호가 일치하지 않습니다.";
//   return null;
// }

// export function validatePasswordReset(email: string): string | null {
//   if (!email.trim()) return "이메일을 입력해 주세요.";
//   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "올바른 이메일 형식이 아닙니다.";
//   return null;
// }

// export function validateHITLAction(comment: string): string | null {
//   if (!comment.trim()) return "승인/거절 사유를 입력해 주세요.";
//   if (comment.trim().length < 5) return "사유를 5자 이상 입력해 주세요.";
//   return null;
// }
