import { useNavigate } from "react-router-dom";
import { AlertTriangle, X } from "lucide-react";
import Logo from "../../components/ui/Logo";
import ThemeToggle from "../../components/ui/ThemeToggle";
import "../../styles/pages/landing.css";

const problems = [
  { title: "로그만으론 전파 경로를 알 수 없다", body: "단일 서비스 로그만으로는 다운스트림 영향을 추적하기 어렵습니다." },
  { title: "단건 판정은 맥락을 놓친다", body: "이전 이벤트와의 연관성 없이 단독으로 판단하면 근본 원인을 놓칩니다." },
  { title: "수동 분석은 대응이 늦다", body: "담당자가 직접 뒤지는 동안 서비스 중단이 장기화됩니다." },
];

const features = [
  { n: "①", title: "멀티모달 수집", body: "Log · Metric · Trace를 타임스탬프 기준 교차 정렬해 통합 뷰를 구성합니다." },
  { n: "②", title: "AI 멀티에이전트 RCA", body: "모달리티별 에이전트 병렬 분석 후 원인·전파 경로를 자동 복원합니다." },
  { n: "③", title: "구조화 리포트", body: "요약·원인·영향·조치를 자동 생성해 즉시 활용 가능한 RCA 리포트를 제공합니다." },
];

const flow = [
  { n: 1, title: "데이터 수집", body: "Log·Metric·Trace\n실시간 수집" },
  { n: 2, title: "이상 감지", body: "임계값·패턴 기반\n어노말리 탐지" },
  { n: 3, title: "멀티에이전트 분석", body: "병렬 에이전트\nRCA 수행" },
  { n: 4, title: "RCA 리포트", body: "구조화된 리포트\n자동 생성", accent: true },
];

export default function Landing() {
  const nav = useNavigate();
  const goLogin = () => nav("/login");

  return (
    <div className="screen landing-page">
      {/* 네비게이션 */}
      <div className="landing-nav">
        <Logo size="lg" />
        <div className="landing-nav__right">
          <ThemeToggle compact />
          <button onClick={goLogin} className="landing-nav__cta">시작하기 →</button>
        </div>
      </div>

      {/* 히어로 */}
      <div className="landing-hero">
        <div>
          <div className="landing-hero__badge">✦ AI 기반 멀티모달 장애 분석</div>
          <h1 className="landing-hero__title">
            로그만으로는 부족합니다.
            <br />
            <span className="landing-hero__accent">Log · Metric · Trace,</span>
            <br />
            세 가지를 함께 봐야 장애가 보입니다.
          </h1>
          <p className="landing-hero__desc">
            AI 멀티에이전트가 3가지 관측 데이터를 종합 분석해
            <br />
            장애 원인과 전파 경로를 자동으로 복원합니다.
          </p>
          <button onClick={goLogin} className="landing-hero__cta">시작하기 →</button>
        </div>

        {/* 히어로 카드 */}
        <div className="landing-hero__card">
          <div className="landing-hero-card__row">
            <span className="landing-hero-card__badge-high">HIGH</span>
            <span className="landing-hero-card__type">Code_Stop</span>
            <span className="landing-hero-card__status">
              <AlertTriangle size={10} />
              HITL 승인 대기
            </span>
          </div>
          <div className="landing-hero-card__service">media-service</div>
          <div className="landing-hero-card__time">2026-07-01 14:32 KST · 분석 완료 14:33</div>
          <div className="landing-hero-card__signals">
            <div className="landing-hero-card__signal-label">탐지 신호</div>
            <div className="landing-hero-card__signal-list">
              {["● Log: 로그파일 없음", "● Log: 연결실패 200건", "● Trace: span 소실"].map((s) => (
                <div key={s} className="landing-hero-card__signal-item">{s}</div>
              ))}
            </div>
          </div>
          <div className="landing-hero-card__tags">
            <span className="tag tag--error">media-service</span>
            <span className="tag tag--neutral">compose-post</span>
            <span className="tag tag--neutral">nginx</span>
          </div>
        </div>
      </div>

      {/* 문제 제기 */}
      <div className="landing-section landing-section--alt">
        <div className="landing-section__header">
          <h2 className="landing-section__title">기존 방식의 한계</h2>
          <p className="landing-section__desc">로그 하나로는 전체 장애 그림을 볼 수 없습니다</p>
        </div>
        <div className="landing-grid-3">
          {problems.map((p) => (
            <div key={p.title} className="landing-problem-card">
              <div className="landing-problem-card__icon"><X size={20} /></div>
              <div className="landing-problem-card__title">{p.title}</div>
              <div className="landing-problem-card__body">{p.body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 기능 소개 */}
      <div className="landing-section">
        <div className="landing-section__header">
          <h2 className="landing-section__title">chokchok이 하는 일</h2>
          <p className="landing-section__desc">세 가지 관측 데이터를 AI가 통합 분석합니다</p>
        </div>
        <div className="landing-grid-3">
          {features.map((f) => (
            <div key={f.title} className="landing-feature-card">
              <div className="landing-feature-card__icon">{f.n}</div>
              <div className="landing-feature-card__title">{f.title}</div>
              <div className="landing-feature-card__body">{f.body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 동작 흐름 */}
      <div className="landing-section landing-section--alt">
        <div className="landing-section__header">
          <h2 className="landing-section__title">어떻게 동작하나요?</h2>
          <p className="landing-section__desc">4단계로 자동 분석이 완료됩니다</p>
        </div>
        <div className="landing-flow">
          {flow.map((s, i) => (
            <div key={s.n} style={{ display: "contents" }}>
              <div className={`landing-flow-step${s.accent ? " landing-flow-step--accent" : ""}`}>
                <div className={`landing-flow-step__num${s.accent ? " landing-flow-step__num--accent" : ""}`}>{s.n}</div>
                <div className={`landing-flow-step__title${s.accent ? " landing-flow-step__title--accent" : ""}`}>{s.title}</div>
                <div className="landing-flow-step__body">{s.body}</div>
              </div>
              {i < flow.length - 1 && <div className="landing-flow-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>

      {/* 푸터 */}
      <div className="landing-footer">
        <div>
          <div className="landing-footer__brand">chokchok</div>
          <div className="landing-footer__desc">AI 멀티에이전트 기반 자동 장애 원인 분석 서비스</div>
        </div>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="landing-footer__link">GitHub →</a>
      </div>
    </div>
  );
}
