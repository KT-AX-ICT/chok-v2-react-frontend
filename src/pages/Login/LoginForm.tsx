import { Loader2, HelpCircle } from "lucide-react";

interface Props {
  email: string;
  password: string;
  loading: boolean;
  emailError?: string | null;
  passwordError?: string | null;
  formError?: string | null;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onEmailBlur: () => void;
  onPasswordBlur: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const errStyle = { font: "12px system-ui", color: "var(--err-text)" } as const;

export default function LoginForm({
  email, password, loading, emailError, passwordError, formError,
  onEmailChange, onPasswordChange, onEmailBlur, onPasswordBlur, onSubmit,
}: Props) {
  return (
    <div className="login-form-inner">
      <h2 className="login-title">로그인</h2>
      <p className="login-subtitle">계정에 로그인해 RCA 리포트를 확인하세요.</p>
      {/* noValidate: 브라우저 기본 검증 팝업 대신 blur 시 커스텀 에러 메시지(emailError/passwordError)로 표시 */}
      <form onSubmit={onSubmit} className="login-form" noValidate>
        <div>
          <label htmlFor="login-email" className="login-label">이메일</label>
          <input id="login-email" type="email" placeholder="name@company.com"
            value={email} onChange={(e) => onEmailChange(e.target.value)} onBlur={onEmailBlur} className="login-input" />
          {emailError && <span style={errStyle}>{emailError}</span>}
        </div>
        <div>
          <label htmlFor="login-password" className="login-label login-label--with-hint">
            비밀번호
            <span className="login-hint">
              <HelpCircle size={13} />
              <span className="login-hint__tooltip">8~15자 · 영문 · 숫자 · !@# 포함</span>
            </span>
          </label>
          <input id="login-password" type="password" placeholder="••••••••"
            value={password} onChange={(e) => onPasswordChange(e.target.value)} onBlur={onPasswordBlur} className="login-input" />
          {passwordError && <div><span style={errStyle}>{passwordError}</span></div>}
        </div>
        {formError && <span style={errStyle}>{formError}</span>}
        <button type="submit" disabled={loading} className="login-primary-btn">
          {loading ? (<><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />로그인 중...</>) : "로그인"}
        </button>
      </form>
    </div>
  );
}
