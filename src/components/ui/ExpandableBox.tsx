import { useState, type ReactNode, type KeyboardEvent } from "react";
import Modal from "./Modal";

interface Props {
  label: string;
  children: ReactNode;
}

export default function ExpandableBox({ label, children }: Props) {
  const [expanded, setExpanded] = useState(false);

  const open = () => setExpanded(true);
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
  };

  return (
    <>
      <div className="detail-snapshot-label">{label}</div>
      <div
        className="detail-snapshot detail-snapshot--clickable"
        role="button"
        tabIndex={0}
        aria-label={`${label} 확대`}
        onClick={open}
        onKeyDown={onKeyDown}
      >
        {children}
      </div>
      {expanded && (
        <Modal onClose={() => setExpanded(false)}>
          <div className="detail-snapshot-label">{label}</div>
          <div className="detail-snapshot detail-snapshot--expanded">{children}</div>
        </Modal>
      )}
    </>
  );
}
