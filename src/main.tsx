import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
// TODO: 확장판 — 로그인 활성화 시 주석 해제
// import { AuthProvider } from "./context/AuthContext";
import "./index.css";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Missing #root element");
createRoot(rootEl).render(
  <StrictMode>
    <ThemeProvider>
      {/* TODO: 확장판 — 로그인 활성화 시 AuthProvider로 감싸기 */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
