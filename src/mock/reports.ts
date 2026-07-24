import type { Report } from "../types/report";
import { toLocalDateStr } from "../utils/dateUtils";

const _today = toLocalDateStr(new Date());

export const MOCK_REPORTS: Report[] = [
  {
    id: 1,
    severity: "HIGH",
    type: "Network_DNS",
    service: "composepost",
    time: `${_today} 07:28:00`,
    summary: "composepost의 media-service-client 이름해석/연결 실패가 nginx↔composepost 구간 지연과 `/wrk2-api/post/compose` 500 오류로 전파된 것으로 가장 유력합니다.",
  },
  {
    id: 2,
    severity: "MID",
    type: "Perf_CPU",
    service: "node",
    time: `${_today} 12:00:01`,
    summary: "시스템 CPU 경합 감지 · 평균 CPU 45.2% (임계치 40% 초과), 노드 레벨 부하",
  },
  {
    id: 3,
    severity: "LOW",
    type: "Svc_Kill",
    service: "media-service",
    time: `${_today} 12:00:05`,
    summary: "media-service 프로세스 강제 종료 · 재시작 2회 감지 (Starting the media server × 2)",
  },
];
