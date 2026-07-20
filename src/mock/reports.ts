import type { Report } from "../types/report";
import { toLocalDateStr } from "../utils/dateUtils";

const _today = toLocalDateStr(new Date());

export const MOCK_REPORTS: Report[] = [
  {
    id: 1,
    severity: "HIGH",
    type: "Code_Stop",
    service: "media-service",
    time: `${_today} 12:00:03`,
    summary: "media-service 코드 실행 정지 · 로그 에러 600건 (정상 대비 3배), ComposePost 연결 실패",
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
