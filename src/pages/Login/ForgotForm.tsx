import { CheckCircle2 } from "lucide-react";

interface Props {
  email: string;
  resetSent: boolean;
  error?: string | null;
  onEmailChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export default function ForgotForm({ email, resetSent, error, onEmailChange, onSubmit, onBack }: Props) {
  return (
    <div className="screen login-form-inner">
      <div className="login-tag">비밀번호 찾기</div>
      <h2 className="login-title">비밀번호 재설정</h2>
      <p className="login-subtitle" style={{ margin: "0 0 32px" }}>
        가입한 이메일을 입력하면 비밀번호 재설정 링크를 보내드립니다.
      </p>
      {!resetSent ? (
        <form onSubmit={onSubmit} className="login-form">
          <div>
            <label htmlFor="forgot-email" className="login-label">이메일</label>
            <input
              id="forgot-email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="login-input"
              required
            />
          </div>
          {error && <span style={{ font: "12px system-ui", color: "#ef4444" }}>{error}</span>}
          <button type="submit" className="login-primary-btn">재설정 링크 보내기</button>
        </form>
      ) : (
        <div className="login-success">
          <CheckCircle2 size={18} />
          이메일로 링크를 발송했습니다. 이메일을 확인해 주세요.
        </div>
      )}
      <div className="login-footer">
        <button type="button" onClick={onBack} className="login-link">← 로그인으로 돌아가기</button>
      </div>
    </div>
  );
}
