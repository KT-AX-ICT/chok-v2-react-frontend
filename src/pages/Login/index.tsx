import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import Logo from "../../components/ui/Logo";
import type { ApiErrorResponse } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { validateLoginEmail, validateLoginPassword } from "../../utils/validateMessages";
import LoginForm from "./LoginForm";
import "../../styles/pages/login.css";

export default function Login() {
  const nav = useNavigate();
  const { signIn, isAuthed } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 이미 로그인된 상태로 /login에 직접 접근한 경우 대시보드로 돌려보낸다
  if (isAuthed) return <Navigate to="/app/dashboard" replace />;

  const NO_SPACE_MSG = "공백은 사용할 수 없습니다.";

  // 공백은 입력 즉시 제거하고, 방금 공백을 쳤을 때만 안내 메시지를 띄운다(다음 blur/제출 때 정식 검증으로 갱신됨)
  const handleEmailChange = (v: string) => {
    if (/\s/.test(v)) setEmailError(NO_SPACE_MSG);
    else if (emailError === NO_SPACE_MSG) setEmailError(null);
    setEmail(v.replace(/\s/g, ""));
  };
  const handlePasswordChange = (v: string) => {
    if (/\s/.test(v)) setPasswordError(NO_SPACE_MSG);
    else if (passwordError === NO_SPACE_MSG) setPasswordError(null);
    setPassword(v.replace(/\s/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eErr = validateLoginEmail(email);
    const pErr = validateLoginPassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    setFormError(null);
    if (eErr || pErr) return;

    setLoading(true);
    try {
      await signIn(email, password);
      showToast("로그인되었습니다.");
      nav("/app/dashboard");
    } catch (err) {
      // api-spec: INVALID_CREDENTIALS(계정 없음·비번 불일치 동일 처리)는 프론트 자체 문구로 노출, 그 외(네트워크 오류 등)는 일반 메시지
      const code = err instanceof AxiosError
        ? (err.response?.data as ApiErrorResponse | undefined)?.error?.code
        : undefined;
      setFormError(
        code === "INVALID_CREDENTIALS"
          ? "이메일 또는 비밀번호가 일치하지 않습니다."
          : "로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="screen login-page">
      <div className="login-logo"><Logo onClick={() => nav("/")} /></div>
      <div className="login-box">
        <LoginForm
          email={email}
          password={password}
          loading={loading}
          emailError={emailError}
          passwordError={passwordError}
          formError={formError}
          onEmailChange={handleEmailChange}
          onPasswordChange={handlePasswordChange}
          onEmailBlur={() => setEmailError(validateLoginEmail(email))}
          onPasswordBlur={() => setPasswordError(validateLoginPassword(password))}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
