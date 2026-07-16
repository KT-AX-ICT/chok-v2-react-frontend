import { useMemo } from "react";
import { X } from "lucide-react";
import SectionHeader from "../../components/ui/SectionHeader";
import DependencyGraph from "./DependencyGraph";
import type { VizData, FaultEvent } from "../../types/reportDetail";

function computeTimeline(events: FaultEvent[], detectedAt: string | null) {
  const timestamps = [...new Set(events.map((e) => e.timestamp))].sort();
  const n = timestamps.length;
  const pctOf = (ts: string) =>
    n <= 1 ? 0 : Math.round((timestamps.indexOf(ts) / (n - 1)) * 100);

  const ticks = timestamps.map((ts) => ({
    label: ts,
    pct: pctOf(ts),
    isDetection: ts === detectedAt,
  }));

  // services in order of first appearance
  const services: string[] = [];
  for (const e of events) {
    if (!services.includes(e.service)) services.push(e.service);
  }

  const detectedPctVal = detectedAt !== null ? pctOf(detectedAt) : null;

  const rows = services.map((service) => {
    const svcEvents = events.filter((e) => e.service === service);
    const sortedTs   = [...new Set(svcEvents.map((e) => e.timestamp))].sort();
    const isDown     = svcEvents.some((e) => e.isDown);

    const errorStart = pctOf(sortedTs[0]);
    const errorEnd   = pctOf(sortedTs[sortedTs.length - 1]);
    const errorWidth = errorEnd > errorStart ? errorEnd - errorStart : Math.min(4, 100 - errorStart);

    // event markers positioned on the bar
    const markers = svcEvents.map((e) => ({
      pct:    pctOf(e.timestamp),
      source: e.source,
      detail: e.detail,
    }));

    return { service, isDown, errorStart, errorWidth, detectedPct: detectedPctVal, markers };
  });

  return { ticks, rows };
}

interface Props {
  viz: VizData;
}

export default function VizTab({ viz }: Props) {
  const { ticks, rows } = useMemo(
    () => computeTimeline(viz.timeline.events, viz.timeline.detectedAt),
    [viz.timeline],
  );

  const detectionTick = ticks.find((t) => t.isDetection);

  return (
    <div className="detail-panel viz-tab">
      <SectionHeader label="시각화" />

      {/* ① 서비스 의존성 그래프 */}
      <section>
        <div className="viz-section__title">① 서비스 의존성 그래프</div>
        <DependencyGraph data={viz.graph} />
      </section>

      {/* ② 장애 발생·전파 타임라인 */}
      <section>
        <div className="viz-section__title">② 장애 발생·전파 타임라인</div>
        <div className="viz-card">
          {/* 시간축 눈금 */}
          <div className="viz-ticks">
            {ticks.map((tick, i) => (
              <div
                key={tick.label}
                className={`viz-tick${tick.isDetection ? " viz-tick--active" : ""}`}
                style={{
                  textAlign: i === 0 ? "left" : i === ticks.length - 1 ? "right" : "center",
                }}
              >
                {tick.label}
              </div>
            ))}
          </div>

          {/* 서비스별 장애 구간 + 이벤트 마커 */}
          <div className="viz-rows">
            {rows.map((row) => (
              <div key={row.service} className="viz-row">
                <div className={`viz-label${row.isDown ? " viz-label--bold viz-label--error" : ""}`}>
                  {row.service}
                  {row.isDown && <X size={10} />}
                </div>
                <div className={`viz-bar${row.isDown ? " viz-bar--error" : ""}`}>
                  {/* 장애 구간 바 */}
                  <div
                    className="viz-bar__fill"
                    style={{ left: `${row.errorStart}%`, width: `${row.errorWidth}%` }}
                  />
                  {/* 감지 마커 */}
                  {row.detectedPct !== null && (
                    <div className="viz-bar__tick" style={{ left: `${row.detectedPct}%` }} />
                  )}
                  {/* 이벤트 마커 (log=빨강, trace=파랑) */}
                  {row.markers.map((m, i) => (
                    <div
                      key={i}
                      className={`viz-bar__event viz-bar__event--${m.source}`}
                      style={{ left: `${m.pct}%` }}
                      title={m.detail ?? m.source}
                    />
                  ))}
                  {/* 미복구 배지 */}
                  {row.isDown && <div className="viz-bar__badge">× 미복구</div>}
                </div>
              </div>
            ))}
          </div>

          {/* 범례 */}
          <div className="viz-legend" style={{ marginTop: 12, flexWrap: "wrap", gap: 12 }}>
            <div className="viz-legend__item">
              <span className="viz-legend__swatch" />
              장애 구간
            </div>
            <div className="viz-legend__item">
              <span className="viz-bar__event viz-bar__event--log" style={{ position: "static", transform: "none" }} />
              Log 이벤트
            </div>
            <div className="viz-legend__item">
              <span className="viz-bar__event viz-bar__event--trace" style={{ position: "static", transform: "none" }} />
              Trace 이벤트
            </div>
            {detectionTick && (
              <span className="viz-legend__item">▼ {detectionTick.label} 최초 감지</span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
