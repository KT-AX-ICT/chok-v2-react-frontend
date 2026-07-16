interface Props {
  name: string;
  company: string;
  email: string;
  password: string;
  confirmPassword: string;
  error?: string | null;
  onNameChange: (v: string) => void;
  onCompanyChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onConfirmPasswordChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onLogin: () => void;
}

export default function SignupForm({
  name, company, email, password, confirmPassword, error,
  onNameChange, onCompanyChange, onEmailChange, onPasswordChange, onConfirmPasswordChange,
  onSubmit, onLogin,
}: Props) {
  return (
    <div className="screen login-form-inner">
      <div className="login-tag">회원가입</div>
      <h2 className="login-title">계정 만들기</h2>
      <p className="login-subtitle" style={{ margin: "0 0 28px" }}>chokchok AIOps를 무료로 시작하세요.</p>
      <form onSubmit={onSubmit} className="login-form" style={{ gap: 16 }}>
        <div className="login-name-grid">
          <div>
            <label htmlFor="signup-name" className="login-label">이름</label>
            <input id="signup-name" type="text" placeholder="홍길동" value={name} onChange={(e) => onNameChange(e.target.value)} className="login-input login-input--sm" required />
          </div>
          <div>
            <label htmlFor="signup-company" className="login-label">회사명</label>
            <input id="signup-company" type="text" placeholder="(주)회사" value={company} onChange={(e) => onCompanyChange(e.target.value)} className="login-input login-input--sm" />
          </div>
        </div>
        <div>
          <label htmlFor="signup-email" className="login-label">이메일</label>
          <input id="signup-email" type="email" placeholder="name@company.com" value={email} onChange={(e) => onEmailChange(e.target.value)} className="login-input" required />
        </div>
        <div>
          <label htmlFor="signup-password" className="login-label">
            비밀번호 <span style={{ color: "var(--text3)", fontWeight: 400 }}>(8자 이상)</span>
          </label>
          <input id="signup-password" type="password" placeholder="••••••••" value={password} onChange={(e) => onPasswordChange(e.target.value)} className="login-input" required />
        </div>
        <div>
          <label htmlFor="signup-confirm" className="login-label">비밀번호 확인</label>
          <input id="signup-confirm" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => onConfirmPasswordChange(e.target.value)} className="login-input" required />
        </div>
        {error && <span style={{ font: "12px system-ui", color: "#ef4444" }}>{error}</span>}
        <button type="submit" className="login-primary-btn">계정 생성</button>
        <div className="login-terms">
          가입 시 <span className="login-link">이용약관</span> 및 <span className="login-link">개인정보처리방침</span>에 동의합니다.
        </div>
      </form>
      <div className="login-footer" style={{ marginTop: 20 }}>
        이미 계정이 있으신가요?{" "}
        <button type="button" onClick={onLogin} className="login-link">로그인</button>
      </div>
    </div>
  );
}
