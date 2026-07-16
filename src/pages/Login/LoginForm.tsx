import { Loader2 } from "lucide-react";

interface Props {
  email: string;
  password: string;
  loading: boolean;
  error?: string | null;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onForgot: () => void;
  onSignup: () => void;
}

export default function LoginForm({ email, password, loading, error, onEmailChange, onPasswordChange, onSubmit, onForgot, onSignup }: Props) {
  return (
    <div className="login-form-inner">
      <h2 className="login-title">로그인</h2>
      <p className="login-subtitle">계정에 로그인해 RCA 리포트를 확인하세요.</p>
      <form onSubmit={onSubmit} className="login-form">
        <div>
          <label htmlFor="login-email" className="login-label">이메일</label>
          <input id="login-email" type="email" placeholder="name@company.com" value={email} onChange={(e) => onEmailChange(e.target.value)} className="login-input" />
        </div>
        <div>
          <label htmlFor="login-password" className="login-label">비밀번호</label>
          <input id="login-password" type="password" placeholder="••••••••" value={password} onChange={(e) => onPasswordChange(e.target.value)} className="login-input" />
        </div>
        {error && <span style={{ font: "12px system-ui", color: "#ef4444" }}>{error}</span>}
        <div className="login-row">
          <label className="login-remember">
            <input type="checkbox" style={{ width: 16, height: 16, accentColor: "var(--brand)" }} />
            로그인 유지
          </label>
          <button type="button" onClick={onForgot} className="login-forgot">비밀번호 찾기</button>
        </div>
        <button type="submit" disabled={loading} className="login-primary-btn">
          {loading ? (
            <>
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
              로그인 중...
            </>
          ) : "로그인"}
        </button>
      </form>
      <div className="login-footer">
        계정이 없으신가요?{" "}
        <button type="button" onClick={onSignup} className="login-link">회원가입</button>
      </div>
    </div>
  );
}
