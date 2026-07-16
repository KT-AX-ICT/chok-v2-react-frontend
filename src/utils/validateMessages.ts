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
