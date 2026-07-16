# chokchok — AI 멀티에이전트 장애 분석 (AIOps)

> 프로덕션: https://chokchok-sigma.vercel.app

| 분류 | 기술 | 버전 | 비고 |
|---|---|---|---|
| UI 라이브러리 | React | 18 | |
| 언어 | TypeScript | 5.7 | strict 모드 |
| 번들러 / 개발 서버 | Vite | 6 | |
| 라우팅 | React Router | 7 | |
| HTTP 클라이언트 | Axios | 1.7 | 백엔드 미연결 시 목 데이터 폴백 |
| 스타일링 | Tailwind CSS | 4 | `@tailwindcss/vite` 플러그인, CSS-first 설정 |
| 아이콘 | lucide-react | 0.469 | AlertTriangle · CheckCircle2 · Zap · Check · X 등 |
| 그래프 시각화 | @xyflow/react | 12 | 서비스 의존성 그래프 (React Flow) |
| 그래프 레이아웃 | @dagrejs/dagre | 3 | 노드 자동 배치 (LR 방향) |

## 데모

> 프로덕션: https://chokchok-sigma.vercel.app

`VITE_USE_MOCK=true` 환경에서 목 데이터로 동작합니다. 별도 로그인 없이 대시보드에 바로 진입됩니다.

---

## 실행

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 타입체크 + 프로덕션 빌드
npm run preview
```

## 배포 설정

`vercel.json`에 SPA rewrite 규칙이 설정되어 있어 `/app/dashboard` 등 모든 경로에서 새로고침·직접 접근 시 `index.html`로 fallback됩니다.

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

## 백엔드 연결

`.env.local`에 아래 값을 설정합니다.

```
VITE_API_BASE_URL=http://localhost:8080
VITE_USE_MOCK=true   # true = mock 폴백 / false 또는 미설정 = 실 API
```

**Spring 기대 엔드포인트**

| Method | Path | 화면 |
|--------|------|------|
| GET | `/api/dashboard` | 대시보드 (집계 + 최근 리포트) |
| GET | `/api/reports` | 리포트 목록 |
| GET | `/api/reports/{id}` | 리포트 상세 |

Spring 백엔드 연결 시 `severity` 필드는 `HIGH/MID/LOW` 문자열로 반환되며, 프론트에서 소문자로 매핑합니다.

> **목 데이터 폴백:** `VITE_USE_MOCK=true`일 때 API 실패 시 mock 데이터로 폴백합니다.
> 실 API 연결 후에는 `VITE_USE_MOCK=false`로 변경하거나 제거하세요.

## 구조

```
src/
├─ main.tsx                        # 엔트리 · Provider · Router
├─ App.tsx                         # 라우트 정의
├─ index.css                       # Tailwind 4 + 디자인 토큰(라이트/다크) + 기본 리셋
│
├─ api/
│  ├─ client.ts                    # Axios 인스턴스 + 인터셉터 (인증 토큰 주입)
│  └─ reports.ts                   # fetchDashboard / fetchReports / fetchReport / fetchReportDetail — 목 폴백 포함
│
├─ mock/                           # MVP 목 데이터 (백엔드 미연결 시 폴백)
│  ├─ reports.ts                   # MOCK_REPORTS — 리포트 목록 3건
│  ├─ reportDetail.ts              # MOCK_REPORT_DETAIL — RCA · 근거 · 영향 · 조치
│  └─ dashboard.ts                 # MOCK_DASHBOARD — 집계 + 최근 리포트 (MOCK_REPORTS에서 파생)
│
├─ types/
│  ├─ report.ts                    # Severity / ReportStatus 타입, SEVERITY_META / STATUS_META
│  ├─ reportDetail.ts              # ReportDetail · AgentEvidence · VizData (확장판 타입 포함)
│  └─ dashboard.ts                 # DashboardSummary · DashboardData
│
├─ context/
│  ├─ ThemeContext.tsx             # 다크 모드 상태 (localStorage 유지)
│  └─ AuthContext.tsx              # 로그인 상태 (localStorage 유지)
│
├─ components/
│  ├─ layout/
│  │  ├─ AppShell.tsx             # Sidebar + Header + Outlet 조합
│  │  ├─ Sidebar.tsx              # 네비게이션 · 파이프라인 상태 · 사용자 정보
│  │  ├─ Header.tsx               # 상단 바 (ThemeToggle)
│  │  └─ RequireAuth.tsx          # 보호 라우트 (미로그인 시 /login 리다이렉트)
│  └─ ui/
│     ├─ Logo.tsx                 # 애니메이션 chokchok 로고
│     ├─ ThemeToggle.tsx          # 라이트/다크 토글 버튼
│     └─ SectionHeader.tsx        # 공통 섹션 헤더 (accent bar + 레이블)
│
├─ pages/
│  ├─ Landing/
│  │  └─ index.tsx                # 서비스 소개 랜딩 페이지
│  ├─ Login/
│  │  ├─ index.tsx                # 상태 관리 + 폼 전환
│  │  ├─ LoginForm.tsx            # 로그인 폼
│  │  ├─ ForgotForm.tsx           # 비밀번호 찾기 폼
│  │  └─ SignupForm.tsx           # 회원가입 폼
│  ├─ Dashboard/
│  │  └─ index.tsx                # KPI 카드 · HITL 알림 · 최근 리포트
│  ├─ Reports/
│  │  └─ index.tsx                # 필터 · 검색 · 정렬 · 페이지네이션
│  └─ ReportDetail/
│     ├─ index.tsx                # 헤더 · HITL 패널 · RCA 블록 · 탭 네비 (탭: 요약·원인·영향·조치, 시각화 탭 주석 처리)
│     ├─ SummaryTab.tsx
│     ├─ CauseTab.tsx             # Log/Metric/Trace 서브탭 포함
│     ├─ ImpactTab.tsx
│     ├─ ActionTab.tsx
│     ├─ AgentLogTab.tsx
│     ├─ VizTab.tsx               # 시각화 탭 — 현재 주석 처리 (히트맵 방식으로 재설계 예정)
│     ├─ DependencyGraph.tsx      # React Flow + dagre 서비스 의존성 그래프
│     └─ NotFound.tsx             # 404 에러 화면 — 구현만 해두고 미연결 (REPORT_NOT_FOUND 연동 후 사용 예정)
│
├─ utils/
│  ├─ dateUtils.ts                # toLocalDateStr — Date → "YYYY-MM-DD" 로컬 날짜 변환
│  ├─ eventHandlers.ts            # 필터·검색·정렬·HITL 이벤트 핸들러
│  └─ validateMessages.ts         # 로그인·회원가입·비번찾기·HITL 입력 검증
│
└─ styles/
   ├─ shared.css                   # 공통 컴포넌트 스타일 (Tailwind @apply 기반, 페이지 무관 재사용)
   ├─ components/
   │  └─ sidebar.css              # Sidebar · Header 컴포넌트 스타일
   └─ pages/                      # 페이지별 고유 CSS (BEM 플랫 구조)
      ├─ reports.css
      ├─ dashboard.css
      ├─ report-detail.css
      ├─ landing.css
      └─ login.css
```

### CSS 컨벤션

- `src/index.css`: 전역 디자인 토큰 (`--surface`, `--brand`, `--text1` 등), 라이트/다크 모드, `shared.css` import
- `src/styles/shared.css`: 페이지 공통 컴포넌트 스타일 (`@layer components { @apply ... }`). `.sev-badge`, `.status-badge`, `.chip`, `.tag`, `.section-label`, `.section-header`, `.card`, `.btn-primary`, `.btn-ok`, `.btn-err` 등
- `src/styles/pages/`: 페이지별 고유 BEM 클래스. 중첩 없이 `.block__element`, `.block--modifier` 플랫 선언
- 동적 색상(severity/status별 배경·텍스트)만 인라인 `style` 유지, 나머지는 모두 CSS 클래스

## 라우트

| 경로 | 화면 | 상태 |
|---|---|---|
| `/` | → `/app/dashboard` 리다이렉트 | ✅ 활성 |
| `/app/dashboard` | 대시보드 (KPI · 최근 리포트) | ✅ 활성 |
| `/app/reports` | 리포트 목록 | ✅ 활성 |
| `/app/reports/:id` | 리포트 상세 | ✅ 활성 |
| `/` (랜딩) | 서비스 소개 랜딩 페이지 | ⏸ 확장판 |
| `/login` | 로그인 · 회원가입 · 비밀번호 찾기 | ⏸ 확장판 |

## 확장판 비활성화 항목

| 항목 | 파일 | 복원 방법 |
|---|---|---|
| 랜딩 페이지 | `src/pages/Landing/` | `App.tsx` TODO 주석 해제 |
| 로그인·회원가입 | `src/pages/Login/` | `App.tsx` TODO 주석 해제 + `RequireAuth` 복원 |
| 사이드바 유저 정보·로그아웃 | `src/components/layout/Sidebar.tsx` | TODO 주석 해제 |
| 대시보드 HITL KPI·알림 배너 | `src/pages/Dashboard/index.tsx` | HITL 확장 방향 확정 후 TODO 주석 해제 (ReportDetail HITL 패널과 함께) |
| 시각화 탭 (FR-S-05) | `src/pages/ReportDetail/VizTab.tsx` | 히트맵 재설계 후 TODO 주석 해제 |
| 404 에러 화면 | `src/pages/ReportDetail/NotFound.tsx` | Spring이 `REPORT_NOT_FOUND` 응답 시 `index.tsx`의 catch 분기 수정 후 TODO 주석 해제 |

## MVP 심각도 체계

| 심각도 | status | 아이콘 |
|---|---|---|
| HIGH | hitl (HITL 승인 대기 — 확장판) | `AlertTriangle` |
| MID | auto (자동 처리 완료) | `Zap` |
| LOW | auto (자동 처리 완료) | `Zap` |

## 요구사항 구현 현황

| ID | 요구사항 | 우선순위 | 상태 |
|---|---|---|---|
| FR-S-04 | 리포트 조회 UI | M | ✅ 완료 |
| FR-S-02 | 리포트 목록·상세 조회 API | M | ✅ 완료 (목 데이터 폴백) |
| FR-A-03 | 원인·전파 복원 + 대응방안 화면 | M | ✅ 완료 |
| FR-S-05 | 원인·전파 경로·근거 시각화 | C | ⏸ 주석 처리 (히트맵 재설계 예정) |
| NFR-08 | 에이전트 호출 로그·근거 출처 | 선택 | ✅ 완료 (에이전트 로그 탭) |
| FR-S-03 | 리포트 비교·이력 조회 | C | ⏳ 보류 |
