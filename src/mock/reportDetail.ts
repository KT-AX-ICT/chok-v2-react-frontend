import type { ReportDetail, MetricItem } from "../types/reportDetail";

export type { AgentTab } from "../types/reportDetail";

// api-spec §2 evidence.metric.items 실 데이터 200건 — label/value가 한 줄씩 번갈아 나온다
const RAW_METRIC_ITEMS = `
system_network_transmit_bytes
465.033
container_cpu
0
container_cpu
1.60083e-05
container_memory
5.09542e+06
container_memory
4.87424e+06
container_network_receive
28.9612
container_network_transmit
0
container_network_transmit
0
container_network_transmit
0
container_network_transmit
0
container_network_transmit
0
container_network_transmit
0
jaeger_spans_rate
0
system_network_errors
0
system_network_receive_bytes
26.9937
container_cpu
9.83523e-07
container_network_receive
2.02486
system_disk_io_time
0.0172737
system_disk_write_bytes
97283.6
system_disk_usage_percent
37.8587
container_cpu
0.00083743
container_cpu
0.000716078
container_cpu
0.00362878
container_cpu
0.000111293
container_cpu
0.00226526
container_cpu
0.000385633
container_cpu
0.0051285
container_cpu
0.00393083
container_cpu
0.00106459
container_cpu
0.00047859
container_cpu
0.000218656
container_cpu
0.000107673
container_cpu
0.00499252
container_cpu
0.000383409
container_cpu
0.000844045
container_memory
2.02342e+06
container_memory
2.96141e+06
container_memory
2.53952e+06
container_memory
2.32243e+06
container_memory
6.13581e+07
container_memory
9.17217e+07
container_memory
6.0588e+07
container_memory
1.10019e+07
container_memory
6.00556e+07
container_memory
2.35614e+08
container_memory
6.16448e+06
container_memory
1.51552e+06
container_memory
3.75603e+06
container_memory
1.55116e+07
container_memory
6.18291e+07
container_memory
2.16269e+06
container_memory
9.80992e+06
container_memory
1.52617e+07
container_network_receive
0
container_network_receive
327.37
container_network_receive
572.389
container_network_receive
658.167
container_network_receive
1019.59
container_network_receive
0
container_network_receive
0
container_network_receive
0
container_network_receive
68.8846
container_network_receive
2325.97
container_network_receive
0
container_network_receive
105.122
container_network_receive
336.307
container_network_receive
356.558
container_network_receive
279.95
container_network_receive
1231.51
container_network_receive
128.427
container_network_receive
0
container_network_receive
0
container_network_receive
67.4639
container_network_receive
190.85
container_network_receive
355.623
container_network_receive
219.159
container_network_receive
94.3631
container_network_receive
1718.71
container_network_transmit
617.93
container_network_transmit
62.1919
container_network_transmit
1020.66
container_network_transmit
40.9926
container_network_transmit
2901.01
container_network_transmit
58.6756
container_network_transmit
246.475
container_network_transmit
761.261
container_network_transmit
209.73
container_network_transmit
890.375
container_network_transmit
189.148
container_network_transmit
41.9139
container_network_transmit
61.5203
container_network_transmit
0
container_network_transmit
42.0568
container_network_transmit
165.732
container_network_transmit
340.689
container_network_transmit
1193.21
container_network_transmit
39.1626
container_network_transmit
735.979
system_disk_usage_percent
37.8589
container_cpu
0.000835496
container_cpu
0.000716234
container_cpu
0.00357431
container_cpu
0.00228368
container_cpu
0.000379862
container_cpu
0.00512521
container_cpu
0.00392052
container_cpu
0.00105192
container_cpu
0.000471386
container_cpu
0.00021653
container_cpu
0.000107529
container_cpu
0.00498871
container_cpu
0.000377034
container_cpu
0.000830418
container_memory
2.02342e+06
container_memory
2.88358e+06
container_memory
2.53952e+06
container_memory
2.38387e+06
container_memory
6.16038e+07
container_memory
9.17217e+07
container_memory
6.06618e+07
container_memory
1.09732e+07
container_memory
6.0375e+07
container_memory
2.35373e+08
container_memory
5.91462e+06
container_memory
1.51552e+06
container_memory
3.75603e+06
container_memory
1.55443e+07
container_memory
6.17062e+07
container_memory
2.16269e+06
container_memory
1.52617e+07
container_network_receive
0
container_network_receive
328.897
container_network_receive
582.519
container_network_receive
658.407
container_network_receive
966.904
container_network_receive
0
container_network_receive
0
container_network_receive
0
container_network_receive
2310.6
container_network_receive
0
container_network_receive
104.457
container_network_receive
332.869
container_network_receive
351.668
container_network_receive
280.12
container_network_receive
1222.13
container_network_receive
126.564
container_network_receive
0
container_network_receive
0
container_network_receive
67.5348
container_cpu
0.000108158
container_memory
9.90003e+06
container_network_receive
67.4978
container_memory
1.18759e+08
container_memory
2.01114e+06
container_memory
2.20774e+06
container_memory
1.40493e+06
container_memory
1.46227e+06
container_memory
4.82099e+06
container_memory
2.09715e+06
container_memory
1.02195e+07
container_memory
1.16941e+07
container_memory
2.68329e+07
container_memory
1.82968e+07
container_memory
2.00704e+06
system_memory_usage_percent
7.9202
container_cpu
0.00694935
container_cpu
0.000302618
container_cpu
0.000320748
container_cpu
1.52399e-05
container_cpu
0.000387803
container_cpu
0.000246861
container_cpu
1.62428e-05
container_cpu
0.000355708
container_cpu
0.00140273
container_cpu
1.76944e-05
container_cpu
0.000362202
container_cpu
0.000385276
container_cpu
0.000333022
container_memory
2.01114e+06
container_memory
2.20774e+06
container_memory
1.40493e+06
container_memory
1.46227e+06
container_memory
5.08314e+06
container_memory
2.09715e+06
container_memory
1.03465e+07
container_memory
1.16941e+07
container_memory
3.19324e+07
container_memory
2.00704e+06
container_network_receive
22.2251
container_network_receive
6.68835
container_network_receive
1645.68
container_network_receive
3.56977
container_network_transmit
1277.23
container_network_transmit
409.538
container_network_transmit
78.7774
container_network_transmit
33.2585
container_network_transmit
4.94054
system_cpu_usage
53.4917
system_load1
17.83
system_disk_read_bytes
16.3693
`.trim().split("\n").map((s) => s.trim()).filter(Boolean);

function pairsToMetricItems(raw: string[]): MetricItem[] {
  const items: MetricItem[] = [];
  for (let i = 0; i < raw.length; i += 2) {
    items.push({ label: raw[i], value: raw[i + 1] });
  }
  return items;
}

export const MOCK_REPORT_DETAIL: ReportDetail = {
  rca: {
    rootCause:
      "가장 유력한 근본 원인은 composepost 경로에서 media-service-client 대상 이름해석 또는 연결이 실패한 것입니다. 로그에서 2026-Jul-24 07:25:03~07:28:05 동안 composepost의 `Failed to connect media-service-client`와 nginx의 `Could not resolve host for client socket`가 반복되었고, trace에서도 nginx와 composepost 사이 요청 처리 구간만 비정상적으로 길며 composepost 내부 하위 호출은 정상 범위였습니다. 다만 log/metric/trace 모두 부분 관측 신호가 있으므로, 이는 일부만 본 상태의 결론입니다. user 서비스의 MongoDB duplicate key 오류는 같은 구간의 별도 이상징후로 보이나 현재 증거만으로 composepost 장애의 원인으로 연결되지는 않습니다.",
    propagation:
      "composepost의 media-service-client 이름해석/연결 실패 → nginx↔composepost 요청 처리 구간 지연(`compose_post_client` 26.882s~64.485s) → nginx `/wrk2-api/post/compose` 500 오류(14/16) → hometimeline/usertimeline 볼륨 감소 및 이후 네트워크/CPU 부하 증가",
  },
  summary: {
    highlight:
      "composepost의 media-service-client 이름해석/연결 실패가 nginx↔composepost 구간 지연과 `/wrk2-api/post/compose` 500 오류로 전파된 것으로 가장 유력합니다.",
    chips: ["composepost", "nginx", "media-service-client", "부분 관측", "핵심 compose API 영향"],
    errorTags: [
      "Failed to connect media-service-client",
      "Could not resolve host for client socket",
      "/wrk2-api/post/compose 500",
      "compose_post_client latency",
      "E11000 duplicate key",
    ],
    neutralTags: [
      "window 2026-07-24T07:25:00.614592 ~ 2026-07-24T07:31:00.614592",
      "trigger trace 2026-07-24T07:28:00.614592",
      "metric 93/105건 부분 관측",
    ],
  },
  evidence: {
    log: {
      source: "provided logs (전체 11810건 중 주요 200건 수록)",
      conclusion:
        "이 구간의 로그는 두 가지 이상징후가 보입니다. 첫째, user 서비스에서 2026-Jul-24 07:25:03.487624~07:29:05.755942 동안 `Failed to insert user j1 to MongoDB: E11000 duplicate key error ... user_id: 444`가 46회 반복되어, 동일 user_id 중복 삽입이 지속되었습니다. 둘째, compose-post 경로에서는 07:25:03~07:28:05 사이 nginx의 `Could not resolve host for client socket`와 composepost의 `Failed to connect media-service-client`가 35회씩 발생해 media-service 연결/이름해석 실패가 트리거 시각 2026-07-24T07:28:00.614592 전부터 이어졌고 직후까지 이어졌습니다. 또한 07:29:07~07:29:10에 여러 서비스의 `Starting the ... server...` 로그가 보여, 일부 서비스 재시작이 있었던 것으로 보이지만, 이는 본문 일부만 본 상태의 결론입니다.",
      lines: [
        { timestamp: "", level: "INFO",  msg: "[]Thrift: Fri Jul 24 07:25:03 2026 TSocket::open() getaddrinfo() <Host: media-service Port: 9090>Name or service not known" },
        { timestamp: "", level: "ERROR", msg: "[ERROR]2026/07/24 07:25:03 [error] 9#9: *902 [lua] compose.lua:62: ComposePost(): compost_post failure: Could not resolve host for client socket., client: 192.168.64.1, server: localhost, request: \"POST /wrk2-api/post/compose HTTP/1.1\", host: \"localhost:8080\"" },
        { timestamp: "", level: "INFO",  msg: "[INFO][2026-Jul-24 07:25:03.485578] <info>: (UserHandler.h:123:RegisterUserWithId) Received RegisterUserWithId request [req_id=214470888432565280, username=j1, user_id=444]" },
        { timestamp: "", level: "ERROR", msg: "[ERROR][2026-Jul-24 07:25:03.487624] <error>: (UserHandler.h:190:RegisterUserWithId) Failed to insert user j1 to MongoDB: E11000 duplicate key error collection: user.user index: user_id_1 dup key: { user_id: 444 }" },
        { timestamp: "", level: "INFO",  msg: "[INFO][2026-Jul-24 07:25:03.491341] <info>: (SocialGraphHandler.h:308:Unfollow) Received Unfollow request [req_id=250957775523506624, user_id=95, followee_id=941]" },
        { timestamp: "", level: "INFO",  msg: "[INFO][2026-Jul-24 07:25:03.496173] <info>: (UserTimelineHandler.h:194:ReadUserTimeline) Received ReadUserTimeline request [req_id=557810099375437440, user_id=31, start=-930050225, stop=232]" },
        { timestamp: "", level: "INFO",  msg: "[INFO][2026-Jul-24 07:25:03.499347] <info>: (UserTimelineHandler.h:194:ReadUserTimeline) Received ReadUserTimeline request [req_id=9005606750615863, user_id=849, start=497, stop=-38443418]" },
        { timestamp: "", level: "INFO",  msg: "[INFO][2026-Jul-24 07:25:03.503039] <info>: (UserTimelineHandler.h:194:ReadUserTimeline) Received ReadUserTimeline request [req_id=390237463503047168, user_id=865, start=212, stop=844]" },
        { timestamp: "", level: "INFO",  msg: "[INFO][2026-Jul-24 07:25:03.504218] <info>: (PostStorageHandler.h:367:ReadPosts) Received ReadPosts request [req_id=390237463503047168, post_ids count=0]" },
        { timestamp: "", level: "INFO",  msg: "[INFO][2026-Jul-24 07:25:03.504565] <info>: (UserTimelineHandler.h:366:ReadUserTimeline) ReadUserTimeline completed [req_id=390237463503047168, user_id=865, return count=0]" },
        { timestamp: "", level: "INFO",  msg: "[INFO][2026-Jul-24 07:25:03.512178] <info>: (ComposePostHandler.h:372:ComposePost) start process compose post request [req_id=953291639474888832, user=6T1]" },
        { timestamp: "", level: "INFO",  msg: "[INFO][2026-Jul-24 07:25:03.512682] <info>: (TextHandler.h:45:ComposeText) Received ComposeText request [req_id=953291639474888832, text length=16]" },
      ],
    },
    trace: {
      source: "trace (전체 242건 중 주요 200건 수록)",
      conclusion:
        "부분 수집된 트레이스 기준으로, nginx의 /wrk2-api/post/compose에서 14/16 오류와 14ms 내외의 즉시 500이 보이는 반면, nginx의 compose_post_client는 26.882s~64.485s로 비정상적으로 길고, composepost 내부의 compose_post_server 및 하위 호출(text/media/creator/uniqueid)은 모두 수 ms~수십 ms 수준으로 정상입니다. 따라서 전파 경로는 nginx → composepost 요청 처리 구간에서 문제로 보이며, 그 여파로 hometimeline/usertimeline 볼륨이 뒤이어 줄어드는 양상이 관측됩니다.",
      spans: [
        { traceId: "2c438103d790d926", from: "", to: "/wrk2-api/post/compose (500)", duration: "14",    status: "error" },
        { traceId: "2c438103d790d926", from: "", to: "compose_post_client",          duration: "16145", status: "timeout" },
        { traceId: "2c438103d790d926", from: "", to: "compose_post_server",          duration: "12",    status: "ok" },
        { traceId: "2c438103d790d926", from: "", to: "compose_text_client",          duration: "4",     status: "ok" },
        { traceId: "2c438103d790d926", from: "", to: "compose_creator_client",       duration: "0",     status: "ok" },
        { traceId: "2c438103d790d926", from: "", to: "compose_media_client",         duration: "12",    status: "ok" },
        { traceId: "2c438103d790d926", from: "", to: "compose_unique_id_client",     duration: "0",     status: "ok" },
        { traceId: "2c438103d790d926", from: "", to: "compose_creator_server",       duration: "0",     status: "ok" },
        { traceId: "2c438103d790d926", from: "", to: "compose_unique_id_server",     duration: "0",     status: "ok" },
        { traceId: "2c438103d790d926", from: "", to: "compose_text_server",          duration: "3",     status: "ok" },
        { traceId: "2c438103d790d926", from: "", to: "compose_urls_client",          duration: "1",     status: "ok" },
        { traceId: "2c438103d790d926", from: "", to: "compose_user_mentions_client", duration: "0",     status: "ok" },
        { traceId: "2c438103d790d926", from: "", to: "compose_user_mentions_server", duration: "0",     status: "ok" },
      ],
    },
    metric: {
      source: "메트릭 시리즈 통계 (전체 3213건 중 주요 200건 수록)",
      conclusion:
        "메트릭은 일부 관측(각 서비스 93/105건) 기준에서 이상 신호가 보입니다. 트리거 시각 2026-07-24T07:28:00.614592 이후 2026-07-24T07:28:19~2026-07-24T07:28:21에 여러 서비스의 container_network_receive/transmit가 baseline 대비 크게 증가하고 일부 container_cpu도 동반 상승해, 먼저 트래픽/처리량 급증이 관측됩니다. 이후 2026-07-24T07:30:26에 __node__ system_cpu_usage가 baseline 3.4에서 peak 80.37까지 급등하고 2026-07-24T07:30:43에 system_load1도 상승해 노드 부하 증가가 뒤따랐습니다.",
      items: pairsToMetricItems(RAW_METRIC_ITEMS),
    },
  },
  impact: {
    metrics: [
      { label: "트리거 시각", value: "2026-07-24T07:28:00.614592" },
      { label: "compose API 오류", value: "부분 수집 trace 기준 nginx /wrk2-api/post/compose 14/16 오류" },
      { label: "composepost 연결 오류", value: "2026-Jul-24 07:25:03~07:28:05 사이 `Failed to connect media-service-client` 35회" },
      { label: "nginx 이름해석 오류", value: "2026-Jul-24 07:25:03~07:28:05 사이 `Could not resolve host for client socket` 35회" },
      { label: "지연", value: "nginx `compose_post_client` 26.882s~64.485s" },
      { label: "노드 부하", value: "2026-07-24T07:30:26 `__node__ system_cpu_usage` peak 80.37" },
    ],
    affected: [
      { service: "nginx",                errors: 14, type: "/wrk2-api/post/compose 500 응답" },
      { service: "composepost",          errors: 35, type: "media-service-client 연결 실패" },
      { service: "media-service-client", errors: 0,  type: "이름해석 또는 연결 대상 장애 의심" },
      { service: "hometimeline",         errors: 0,  type: "trace상 후속 볼륨 감소" },
      { service: "usertimeline",         errors: 0,  type: "trace상 후속 볼륨 감소" },
      { service: "user",                 errors: 46, type: "MongoDB duplicate key 오류, 주 원인과의 인과는 미확인" },
    ],
  },
  actions: {
    steps: [
      "2026-Jul-24 07:25:03~07:28:05 구간의 composepost `Failed to connect media-service-client`와 nginx `Could not resolve host for client socket`를 기준으로, composepost 컨테이너에서 media-service-client 대상 DNS 해석, 포트 연결, service discovery/upstream 설정을 즉시 점검합니다.",
      "media-service 및 media-service-client 관련 컨테이너/엔드포인트가 정상 기동 중인지 확인하고, Docker/Kubernetes 네트워크·DNS가 깨졌다면 해당 네트워크 또는 서비스 엔드포인트를 재등록/재시작합니다.",
      "연결성 복구 후 composepost와 nginx를 순차적으로 재시작 또는 upstream reload하여 오래 걸린 `compose_post_client` 호출이 26.882s~64.485s 수준으로 남아 있지 않은지 확인합니다.",
      "`/wrk2-api/post/compose`에 재현 요청을 보내 nginx 500 응답이 사라졌는지, composepost 내부 하위 호출(text/media/creator/uniqueid)이 계속 수 ms~수십 ms 범위인지 확인합니다.",
      "2026-Jul-24 07:29:07~07:29:10에 관측된 여러 서비스 `Starting the ... server...` 로그의 원인을 배포/오케스트레이터 이벤트와 대조해 의도된 재시작인지 확인합니다.",
      "2026-07-24T07:28:19~2026-07-24T07:28:21 네트워크 송수신 급증과 2026-07-24T07:30:26 `__node__ system_cpu_usage` 80.37 급등이 재시도 폭주인지 확인하고, 필요 시 클라이언트/프록시 retry backoff와 rate limit을 적용합니다.",
      "동시 관측된 user 서비스의 `E11000 duplicate key ... user_id: 444` 46회는 본 RCA의 주 전파 경로와 직접 연결된 근거가 부족하므로, user_id 생성/중복 요청/idempotency 문제로 별도 추적합니다.",
    ],
    recovery:
      "증거상 복구 완료 여부는 확인되지 않습니다. 우선 media-service-client 이름해석/연결성을 복구한 뒤 composepost와 nginx 경로의 오류율·지연을 재확인해야 합니다.",
  },
  agentLog: [
    { time: "07:28:01", agent: "Orchestrator", action: "장애 감지 — severity=high, 멀티에이전트 분석 시작" },
    { time: "07:28:02", agent: "Log Agent",    action: "composepost·nginx·user 로그 수집 시작" },
    { time: "07:28:03", agent: "Metric Agent", action: "네트워크·CPU 메트릭 시리즈 수집" },
    { time: "07:28:03", agent: "Trace Agent",  action: "compose 경로 분산 추적 수집" },
    { time: "07:28:09", agent: "Log Agent",    action: "결론 반환 — media-service-client 연결/이름해석 실패 확인" },
    { time: "07:28:11", agent: "Trace Agent",  action: "결론 반환 — nginx↔composepost 구간 지연 확인" },
    { time: "07:28:13", agent: "Metric Agent", action: "결론 반환 — 트래픽 급증 후 노드 부하 상승 패턴 확인" },
    { time: "07:28:15", agent: "Orchestrator", action: "RCA 종합 — 대응 방안 생성 완료" },
  ],
};
