# chok-v2 — AI 멀티에이전트 장애 분석

> 프로덕션(AWS EC2): http://52.78.29.78:5173
> 
> Vercel(테스트용, mock 상태): https://chokchok-sigma.vercel.app

| 분류 | 기술 | 버전 | 비고 |
|---|---|---|---|
| UI 라이브러리 | React | 18 | |
| 언어 | TypeScript | 5.7 | strict 모드 |
| 번들러 / 개발 서버 | Vite | 6 | |
| 라우팅 | React Router | 7 | |
| HTTP 클라이언트 | Axios | 1.7 | Bearer 토큰 자동 첨부 + 401 시 리프레시 토큰 로테이션(RTR) |
| 스타일링 | Tailwind CSS | 4 | `@tailwindcss/vite` 플러그인, CSS-first 설정 |
| 아이콘 | lucide-react | 0.469 | AlertTriangle · CheckCircle2 · Zap · Check · X 등 |

## 실행

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 타입체크 + 프로덕션 빌드
```

## 배포

- **Vercel**: `vercel.json`의 SPA rewrite로 모든 경로가 `index.html`로 fallback.
- **Docker (AWS EC2)**: Node 빌드 → Nginx 서빙. `VITE_*`는 빌드 시 플레이스홀더로 박고 `docker run -e`로 런타임에 치환 (`--build-arg` 아님).
  ```bash
  docker build -t chok-v2-frontend .
  docker run -p 8080:80 -e VITE_API_BASE_URL=http://EC2_IP:8080 -e VITE_USE_MOCK=false chok-v2-frontend
  ```
- CI(`.github/workflows/ci.yml`): PR은 빌드 확인만, `main` push 시 이미지 빌드·푸시.

## 백엔드 연결 / 로컬 E2E

```bash
cp .env.example .env
# VITE_API_BASE_URL=http://localhost:8080
# VITE_USE_MOCK=false  (true면 서버 무응답일 때만 mock 폴백, 4xx/5xx는 그대로 노출)
```

1. Spring 백엔드 기동: `docker compose up -d --build`
2. 시드 실행(최초 1회) — 없으면 로그인 항상 `INVALID_CREDENTIALS`:
   ```bash
   docker compose cp scripts/seed-dev.sql db:/tmp/seed-dev.sql
   docker compose exec db sh -c 'mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" --default-character-set=utf8mb4 "$MYSQL_DATABASE" < /tmp/seed-dev.sql'
   ```
3. `npm run dev` 후 `sn.user@chokchok.dev` / `chokchok1!`로 로그인

백엔드 없이 개발하려면 `VITE_USE_MOCK=true`로 두면 API 실패 시 mock으로 폴백.

**Spring 엔드포인트**: `POST /api/auth/login`·`refresh`(공개), `GET /api/auth/me`·`/api/dashboard`·`/api/reports`·`/api/reports/{id}`(Bearer 필요). 에러는 `{"error":{"code","message"}}` 봉투. `severity`는 `HIGH/MID/LOW`(null 가능). 없는/미완료 id는 `404 REPORT_NOT_FOUND`. 시각은 UTC로 내려와 프론트가 KST로 변환.

## 구조

```
src/
├─ api/        # client(Axios) · auth · reports · tokenStore
├─ mock/       # mock 데이터 (reports · reportDetail · dashboard · auth)
├─ types/      # report · reportDetail · dashboard
├─ context/    # Theme · Auth · Toast
├─ components/ # layout(Sidebar·Header·RequireAuth) · ui(공통 컴포넌트)
├─ pages/      # Login · MyPage · Dashboard · Reports · ReportDetail · NotFound
├─ utils/      # dateUtils · eventHandlers · validateMessages
└─ styles/     # index.css(토큰) · shared.css(공통) · pages/*.css(BEM)
```

CSS는 `index.css`에 라이트/다크 디자인 토큰, `shared.css`에 공통 컴포넌트(`.chip`, `.card`, `.btn-*` 등), 페이지별 스타일은 `styles/pages/`에 BEM으로. 동적 색상만 인라인 `style`, 나머지는 클래스.

## 라우트

`/` → `/app/dashboard` 리다이렉트 · `/app/dashboard` · `/app/reports` · `/app/reports/:id` · `/app/mypage` · `/login` · 그 외 404. 전부 활성.

## 심각도

`HIGH`(빨강) / `MID`(노랑) / `LOW`(초록) 3단계, 뱃지 색으로만 구분. 판정 전(`severity: null`)이면 프론트는 `LOW`로 폴백.

## 요구사항 구현 현황

| ID | 요구사항 | 상태 |
|---|---|---|
| FR-S-04 | 리포트 조회 UI | ✅ |
| FR-S-02 | 리포트 목록·상세 조회 API | ✅ |
| FR-A-03 | 원인·전파 복원 + 대응방안 화면 | ✅ |
| NFR-08 | 에이전트 호출 로그·근거 출처 | ✅ (에이전트 로그 탭) |
