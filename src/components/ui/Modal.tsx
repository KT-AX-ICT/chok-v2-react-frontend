import type { ReactNode } from "react";
import "../../styles/components/modal.css";

interface Props {
  onClose: () => void;
  children: ReactNode;
}

// 배경(오버레이) 클릭 또는 닫기 버튼으로만 닫힘 — 박스 내부 클릭은 전파 차단
export default function Modal({ onClose, children }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" aria-label="닫기" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
