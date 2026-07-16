interface LogoProps {
  size?: "sm" | "lg";
  onClick?: () => void;
  className?: string;
}

function LogoSvgLg() {
  return (
    <svg
      width="186"
      height="40"
      viewBox="0 0 186 40"
      fill="none"
      overflow="visible"
      style={{ display: "block", flexShrink: 0 }}
      role="img"
      aria-label="chokchok"
    >
      <line x1="20" y1="12" x2="8" y2="30" stroke="#2D3A8C" strokeWidth="2" strokeLinecap="round" opacity="0.28" />
      <line x1="20" y1="12" x2="32" y2="30" stroke="#2D3A8C" strokeWidth="2" strokeLinecap="round" opacity="0.28" />
      <line x1="8" y1="34" x2="32" y2="34" stroke="#2D3A8C" strokeWidth="2" strokeLinecap="round" opacity="0.28" />
      <circle cx="20" cy="12" r="0" stroke="#00C9A7" strokeWidth="1.6" fill="none">
        <animate attributeName="r" values="5.5;14" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="20" cy="12" r="0" stroke="#00C9A7" strokeWidth="1" fill="none">
        <animate attributeName="r" values="5.5;14" dur="2s" begin="0.55s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0" dur="2s" begin="0.55s" repeatCount="indefinite" />
      </circle>
      <circle cx="20" cy="12" r="5.5" fill="#2D3A8C" />
      <circle cx="8" cy="34" r="5" fill="#2D3A8C" />
      <circle cx="32" cy="34" r="5" fill="#2D3A8C" />
      <circle cx="32" cy="34" r="2.5" fill="#00C9A7">
        <animate attributeName="r" values="2.5;4.5;2.5" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.25;1" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <text x="48" y="26" fontFamily="'Manrope',system-ui,sans-serif" fontWeight="700" fontSize="20" fill="#2D3A8C" letterSpacing="-0.4">
        chokchok
      </text>
    </svg>
  );
}

function LogoSvgSm() {
  return (
    <svg
      width="144"
      height="36"
      viewBox="0 0 144 36"
      fill="none"
      overflow="visible"
      style={{ display: "block" }}
      role="img"
      aria-label="chokchok"
    >
      <line x1="16" y1="10" x2="6" y2="27" stroke="#2D3A8C" strokeWidth="1.6" strokeLinecap="round" opacity="0.28" />
      <line x1="16" y1="10" x2="26" y2="27" stroke="#2D3A8C" strokeWidth="1.6" strokeLinecap="round" opacity="0.28" />
      <line x1="6" y1="31" x2="26" y2="31" stroke="#2D3A8C" strokeWidth="1.6" strokeLinecap="round" opacity="0.28" />
      <circle cx="16" cy="10" r="0" stroke="#00C9A7" strokeWidth="1.4" fill="none">
        <animate attributeName="r" values="4.5;12" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="16" cy="10" r="0" stroke="#00C9A7" strokeWidth="0.9" fill="none">
        <animate attributeName="r" values="4.5;12" dur="2s" begin="0.55s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0" dur="2s" begin="0.55s" repeatCount="indefinite" />
      </circle>
      <circle cx="16" cy="10" r="4.5" fill="#2D3A8C" />
      <circle cx="6" cy="31" r="4" fill="#2D3A8C" />
      <circle cx="26" cy="31" r="4" fill="#2D3A8C" />
      <circle cx="26" cy="31" r="2" fill="#00C9A7">
        <animate attributeName="r" values="2;3.5;2" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.25;1" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <text x="36" y="22" fontFamily="'Manrope',system-ui,sans-serif" fontWeight="700" fontSize="15" fill="#2D3A8C" letterSpacing="-0.3">
        chokchok
      </text>
    </svg>
  );
}

export default function Logo({ size = "sm", onClick, className }: LogoProps) {
  const svg = size === "lg" ? <LogoSvgLg /> : <LogoSvgSm />;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={className}
        aria-label="홈으로 이동"
        style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex" }}
      >
        {svg}
      </button>
    );
  }

  return <div className={className} style={{ display: "flex" }}>{svg}</div>;
}
