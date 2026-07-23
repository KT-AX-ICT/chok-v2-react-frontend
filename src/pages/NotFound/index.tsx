import { useNavigate } from "react-router-dom";
import "../../styles/pages/not-found.css";

export default function NotFound() {
  const nav = useNavigate();
  return (
    <div className="screen notfound">
      <div className="notfound__code">404</div>
      <div className="notfound__title">페이지를 찾을 수 없습니다</div>
      <button type="button" className="notfound__btn" onClick={() => nav("/app/dashboard")}>
        대시보드로 돌아가기
      </button>
    </div>
  );
}
