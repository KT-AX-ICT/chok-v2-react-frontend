# chok-v2 — AI 멀티에이전트 장애 분석

> 프로덕션: https://chokchok-sigma.vercel.app

| 분류 | 기술 | 버전 | 비고 |
|---|---|---|---|
| UI 라이브러리 | React | 18 | |
| 언어 | TypeScript | 5.7 | strict 모드 |
| 번들러 / 개발 서버 | Vite | 6 | |
| 라우팅 | React Router | 7 | |
| HTTP 클라이언트 | Axios | 1.7 | Bearer 토큰 자동 첨부 + 401 시 리프레시 토큰 로테이션(RTR) / 리포트·대시보드는 백엔드 미연결 시 목 데이터 폴백 |
| 스타일링 | Tailwind CSS | 4 | `@tailwindcss/vite` 플러그인, CSS-first 설정 |
| 아이콘 | lucide-react | 0.469 | AlertTriangle · CheckCircle2 · Zap · Check · X 등 |

## 데모

현재 프로덕션(위 링크)은 백엔드 미연동(mock) 상태라 로그인 이후 화면은 확인할 수 없습니다. 로그인까지 포함한 전체 흐름은 아래 [로컬 E2E](#백엔드-연결--로컬-e2e)로 확인하세요.

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

## 백엔드 연결 / 로컬 E2E

`.env.example`을 복사해 `.env`(git 미추적)를 만들고 아래 값을 설정합니다.

```bash
cp .env.example .env
```

```
VITE_API_BASE_URL=http://localhost:8080
VITE_USE_MOCK=false   # true = 서버 응답 자체가 없을 때만 mock 폴백 (4xx/5xx는 그대로 노출)
```

**로컬 E2E — 프론트 ↔ Spring 직접 연결**

1. Spring 백엔드를 `localhost:8080`에 기동 (`docker compose up -d --build`)
2. Spring 저장소의 `scripts/seed-dev.sql` 실행 (최초 1회, 멱등) — 시드 없으면 로그인 항상 `INVALID_CREDENTIALS`
   ```bash
   docker compose cp scripts/seed-dev.sql db:/tmp/seed-dev.sql
   docker compose exec db sh -c 'mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" --default-character-set=utf8mb4 "$MYSQL_DATABASE" < /tmp/seed-dev.sql'
   ```
3. `VITE_USE_MOCK=false`, 프론트를 `localhost:5173`으로 실행 (`npm run dev`)
4. 샘플 계정으로 로그인: `sn.user@chokchok.dev` / `chokchok1!`

**mock 데이터로 개발 — 백엔드 없이**
- `VITE_USE_MOCK=true` + Spring 미기동 → API 실패 시 mock 데이터로 폴백

**Spring 기대 엔드포인트**

| Method | Path | 인증 | 화면 |
|--------|------|------|------|
| POST | `/api/auth/login` | 공개 | 로그인 |
| POST | `/api/auth/refresh` | 공개 | 액세스 토큰 재발급 (RTR — 401 응답 시 프론트가 자동 호출) |
| GET | `/api/auth/me` | Bearer | 로그인 유저 정보 (마이페이지 · 사이드바) |
| GET | `/api/dashboard` | Bearer | 대시보드 (집계 + 최근 리포트) |
| GET | `/api/reports` | Bearer | 리포트 목록 (`page`·`size`·`severity`·`from`·`to`·`search`·`sort`) |
| GET | `/api/reports/{id}` | Bearer | 리포트 상세 (`{report, counts, detail}` 봉투) |

- Bearer 필요 엔드포인트는 `Authorization: Bearer <accessToken>` 헤더 필수. 없거나 무효면 401, 권한 부족이면 403.
- 에러 응답 공통 봉투: `{"error":{"code":"...","message":"..."}}` (예: 로그인 실패 `INVALID_CREDENTIALS`).
- `severity`는 `HIGH/MID/LOW` 문자열로 반환되며 프론트도 동일 대문자로 사용. 판정 전이면 `null` 가능.
- 없는/미완료(DONE 아님) id는 `404 {error:{code:"REPORT_NOT_FOUND"}}` → 프론트 NotFound 화면으로 연결.
- 시각은 UTC `yyyy-MM-dd HH:mm:ss`로 내려오며 프론트가 KST로 변환해 표시.

**배포 연결:** 실 연동은 Spring 공개 URL 확정 후 결정(같은 도메인 `/api` proxy 또는 별도 도메인 + CORS).

## 구조

```
src/
├─ main.tsx                        # 엔트리 · Provider · Router
├─ App.tsx                         # 라우트 정의
├─ index.css                       # Tailwind 4 + 디자인 토큰(라이트/다크) + 기본 리셋
│
├─ api/
│  ├─ client.ts                    # Axios 인스턴스 + 인터셉터 (Bearer 첨부, 401 시 RTR로 토큰 재발급 후 재시도)
│  ├─ auth.ts                      # loginRequest(POST /api/auth/login) · fetchMe(GET /api/auth/me)
│  ├─ tokenStore.ts                # localStorage 기반 토큰·유저 정보 저장/조회
│  └─ reports.ts                   # fetchDashboard / fetchReports / fetchReportView — 목 폴백 포함
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
│  ├─ AuthContext.tsx              # 로그인 상태 — 로그인 성공 후 /auth/me로 유저 정보 이어서 조회, localStorage 유지
│  └─ ToastContext.tsx             # 하단 토스트 알림 (2.5초 자동 닫힘)
│
├─ components/
│  ├─ layout/
│  │  ├─ AppShell.tsx             # Sidebar + Header + Outlet 조합
│  │  ├─ Sidebar.tsx              # 네비게이션 · 사용자 정보
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
│  │  ├─ index.tsx                # 로그인 상태 관리 + 검증 + 에러 처리
│  │  └─ LoginForm.tsx            # 로그인 폼
│  ├─ MyPage/
│  │  └─ index.tsx                # 내 정보(이름 · 기업 코드) 조회
│  ├─ Dashboard/
│  │  └─ index.tsx                # KPI 카드 · 최근 리포트
│  ├─ Reports/
│  │  └─ index.tsx                # 필터 · 검색 · 정렬 · 페이지네이션
│  ├─ ReportDetail/
│  │  ├─ index.tsx                # 헤더 · RCA 블록 · 탭 네비 (탭: 요약·원인·영향·조치)
│  │  ├─ SummaryTab.tsx
│  │  ├─ CauseTab.tsx             # Log/Metric/Trace 서브탭 포함
│  │  ├─ ImpactTab.tsx
│  │  ├─ ActionTab.tsx
│  │  ├─ AgentLogTab.tsx
│  │  └─ NotFound.tsx             # 리포트 상세 전용 404 — REPORT_NOT_FOUND(없는/미완료 id) 응답 시 표시 (index.tsx catch에서 연결됨)
│  └─ NotFound/
│     └─ index.tsx                # 최상위 404 — 미정의 경로 진입 시 표시
│
├─ utils/
│  ├─ dateUtils.ts                # toLocalDateStr — Date → "YYYY-MM-DD" 로컬 날짜 변환
│  ├─ eventHandlers.ts            # 필터·검색·정렬 이벤트 핸들러
│  └─ validateMessages.ts         # 로그인 입력 검증
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
| `/app/mypage` | 마이페이지 | ✅ 활성 |
| `/app/*`, 미정의 경로 | 404 | ✅ 활성 |
| `/login` | 로그인 | ✅ 활성 |
| `/` (랜딩) | 서비스 소개 랜딩 페이지 | ⏸ 확장판 |

## 확장판 비활성화 항목

| 항목 | 파일 | 복원 방법 |
|---|---|---|
| 랜딩 페이지 | `src/pages/Landing/` | `App.tsx` TODO 주석 해제 |

## MVP 심각도 체계

`severity`는 `HIGH/MID/LOW` 3단계. 뱃지 색으로만 구분합니다 (`status`·아이콘·confidence는 제거).

| 심각도 | 뱃지 색 |
|---|---|
| HIGH | 주황 |
| MID | 노랑 |
| LOW | 초록 |

- 판정 전(LLM 미결)이면 백엔드가 `severity: null` 반환 → 현재 프론트는 `LOW`로 폴백 (중립 "미정" 뱃지 적용은 논의 중).

## 요구사항 구현 현황

| ID | 요구사항 | 우선순위 | 상태 |
|---|---|---|---|
| FR-S-04 | 리포트 조회 UI | M | ✅ 완료 |
| FR-S-02 | 리포트 목록·상세 조회 API | M | ✅ 완료 (목 데이터 폴백) |
| FR-A-03 | 원인·전파 복원 + 대응방안 화면 | M | ✅ 완료 |
| FR-S-05 | 원인·전파 경로·근거 시각화 | C | ⏸ 미구현 (히트맵 방식 재설계 후 별도 구현 예정) |
| NFR-08 | 에이전트 호출 로그·근거 출처 | 선택 | ✅ 완료 (에이전트 로그 탭) |
| FR-S-03 | 리포트 비교·이력 조회 | C | ⏳ 보류 |
