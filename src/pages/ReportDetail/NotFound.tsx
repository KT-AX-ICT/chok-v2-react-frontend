import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  reportId?: string;
}

export default function NotFound({ reportId }: Props) {
  const nav = useNavigate();
  return (
    <div className="screen detail-error">
      <AlertTriangle size={40} className="detail-error__icon" />
      <div className="detail-error__title">리포트를 찾을 수 없습니다</div>
      <div className="detail-error__desc">
        {reportId ? `report_id ${reportId} 이 존재하지 않습니다.` : "요청한 리포트가 존재하지 않습니다."}
      </div>
      <button type="button" onClick={() => nav("/app/reports")} className="detail-error__btn">
        리포트 목록으로 돌아가기
      </button>
    </div>
  );
}
