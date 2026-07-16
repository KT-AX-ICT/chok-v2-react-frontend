// @ts-nocheck — 확장판 파일, 로그인 활성화 시 제거
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/ui/Logo";
import { useAuth } from "../../context/AuthContext";
import { MOCK_DEMO } from "../../api/reports";
// import { validateLogin, validateSignup, validatePasswordReset } from "../../utils/validateMessages"; // TODO: 실 API 연결 시 validateLogin 복구
import { validateSignup, validatePasswordReset } from "../../utils/validateMessages";

const IS_MOCK = import.meta.env.VITE_USE_MOCK === "true";
import LoginForm from "./LoginForm";
import ForgotForm from "./ForgotForm";
import SignupForm from "./SignupForm";
import "../../styles/pages/login.css";

type Sub = "idle" | "loading" | "forgot" | "signup";

export default function Login() {
  const nav = useNavigate();
  const { signIn } = useAuth();
  const [sub, setSub] = useState<Sub>("idle");

  // 로그인
  const [email, setEmail] = useState(IS_MOCK ? MOCK_DEMO.email : "");
  const [password, setPassword] = useState(IS_MOCK ? MOCK_DEMO.password : "");
  const [loginError, setLoginError] = useState<string | null>(null);

  // 회원가입
  const [signupName, setSignupName] = useState("");
  const [signupCompany, setSignupCompany] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupError, setSignupError] = useState<string | null>(null);

  // 비밀번호 찾기
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 실 API 연결 시 아래 주석 해제
    // const err = validateLogin(email, password);
    // if (err) { setLoginError(err); return; }
    setLoginError(null);
    setSub("loading");
    try {
      await signIn(email, password);
      nav("/app/dashboard");
    } catch {
      setLoginError("로그인에 실패했습니다. 다시 시도해 주세요.");
      setSub("idle");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateSignup(signupName, signupEmail, signupPassword, signupConfirm);
    if (err) { setSignupError(err); return; }
    setSignupError(null);
    // 백엔드 미연결 — 검증 통과 후 동일 계정으로 로그인 시도
    setSub("loading");
    try {
      await signIn(signupEmail, signupPassword, signupName);
      nav("/app/dashboard");
    } catch {
      setSignupError("가입 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
      setSub("signup");
    }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validatePasswordReset(forgotEmail);
    if (err) { setForgotError(err); return; }
    setForgotError(null);
    setResetSent(true);
  };

  return (
    <div className="screen login-page">
      <div className="login-logo">
        <Logo onClick={() => nav("/")} />
      </div>

      <div className="login-box">
        {(sub === "idle" || sub === "loading") && (
          <LoginForm
            email={email}
            password={password}
            loading={sub === "loading"}
            error={loginError}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleLogin}
            onForgot={() => { setSub("forgot"); setResetSent(false); setForgotError(null); setLoginError(null); }}
            onSignup={() => { setSub("signup"); setSignupError(null); setLoginError(null); }}
          />
        )}
        {sub === "forgot" && (
          <ForgotForm
            email={forgotEmail}
            resetSent={resetSent}
            error={forgotError}
            onEmailChange={setForgotEmail}
            onSubmit={handleForgot}
            onBack={() => { setSub("idle"); setResetSent(false); setForgotEmail(""); setForgotError(null); }}
          />
        )}
        {sub === "signup" && (
          <SignupForm
            name={signupName}
            company={signupCompany}
            email={signupEmail}
            password={signupPassword}
            confirmPassword={signupConfirm}
            error={signupError}
            onNameChange={setSignupName}
            onCompanyChange={setSignupCompany}
            onEmailChange={setSignupEmail}
            onPasswordChange={setSignupPassword}
            onConfirmPasswordChange={setSignupConfirm}
            onSubmit={handleSignup}
            onLogin={() => { setSub("idle"); setSignupError(null); }}
          />
        )}
      </div>

    </div>
  );
}
