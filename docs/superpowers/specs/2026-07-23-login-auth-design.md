# 로그인/인증 붙이기 — 설계

- 작성일: 2026-07-23 / 갱신: 2026-07-23 (실제 API 명세서 반영)
- 대상: chok-v2 프론트(chokchok) 로그인 실 연동 + 마이페이지
- 2026-07-23 실제 API 명세서를 전달받아 §2·§4·§5·§7의 가정(로그인 응답에 유저 정보 포함, `companyName` 필드)을 실 계약으로 교체함. 백엔드 배포/구현 완료 여부는 별도 확인 필요.

## 1. 범위

**이번에 구현**
- 로그인 실 연동 (검증 + 토큰 저장 + RTR 자동 갱신 + 라우트 가드)
- 회원가입 **삭제**
- 마이페이지 추가 (기업 코드 + 유저명 표시 — `companyName`은 API에 없어 제외)

**플랜만 (이번엔 구현 안 함 — 비밀번호 관련 전부 후순위)**
- 마이페이지 **비밀번호 변경** — 로그인 작업 완료 후 사용자에게 재확인하고 진행. 백엔드 비번변경 API 필요.
- **비밀번호 찾기** — 로그인 화면에 진입점 없음(미구현). 실제 재설정 흐름은 백엔드 재설정 API(메일 발송·토큰 검증·재설정) 확정 후 후순위 도입.

## 2. API 계약 (실제 명세서 기준, 2026-07-23 반영)

```
POST /api/auth/login    req { email, password }
                        res { accessToken, refreshToken, tokenType, expiresIn }   // 유저 정보는 안 옴
                        실패(401) { error: { code: "INVALID_CREDENTIALS", message } }

POST /api/auth/refresh  req { refreshToken }
                        res 로그인과 동일(TokenResponse, 새 access+refresh)      // RTR: access 재발급 시 refresh도 항상 회전
                        실패(401) 만료/서명오류, 또는 access 토큰을 넣으면 "리프레시 토큰이 아닙니다"

GET  /api/auth/me       Bearer 필요 — 토큰 클레임에서 바로 추출(DB 조회 없음)
                        res { email, name, role, companyCode }                   // companyName 필드 없음

// 로그아웃 API 없음 — 클라이언트가 저장소 삭제로 로그아웃
// 에러 응답 공통 봉투: { error: { code, message } } — 401(미인증)·403(권한 부족) 모두 이 형식
// expiresIn: 액세스 토큰 만료까지 초(3600=60분). 리프레시 토큰 유효기간은 14일 — 현재 프론트는 미사용(401 발생 시에만 반응형 refresh)
```

로그인 응답엔 유저 정보가 없으므로, `AuthContext.signIn`은 로그인 → 토큰 저장 → `GET /api/auth/me` 순으로 이어 호출해 유저 정보를 받아온다. `/auth/me` 실패 시 로그인 자체를 실패로 취급하고 저장된 토큰을 롤백한다(반쪽짜리 인증 상태 방지).

## 3. 검증 규칙 (프론트)

**규칙**
- **이메일**: 이메일 형식(`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) + **12~30자**
- **비밀번호**: **8~15자**, 허용 문자 **영대문자·영소문자·숫자·`!@#` 만**, **네 종류 각 1개 이상 필수** (기타 특수문자 불가)
  - 정규식(예): `^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#])[A-Za-z0-9!@#]{8,15}$`

**검증 UX (필드별 인라인)**
- 각 입력칸 **아래에 개별 오류 메시지** 표시 (`LoginForm`에 필드별 error 슬롯 추가):
  - 이메일: "이메일 형식이 아닙니다" / "12~30자로 입력해 주세요"
  - 비밀번호: "8~15자, 영대문자·소문자·숫자·!@# 를 각각 1개 이상 포함해야 합니다"
- **타이밍**: **포커스 벗어날 때(on blur) + 제출 시(on submit)** 검증. 실시간(타이핑 중) 검증은 하지 않음 — 뜬 오류는 다음 blur/제출 때 재검사되어 갱신됨.
- 비밀번호 칸 아래 **규칙 힌트** 상시 노출("8~15자 · 대/소문자 · 숫자 · !@# 포함").
- **제출 시**: 하나라도 규칙 위반이면 API 호출 안 하고 해당 필드 오류 표시. (자격 오류 등 API 응답 오류는 §5-1의 폼 상단/공통 메시지)

## 4. 인증 상태 · localStorage

- 키 **`token`** = JSON `{ accessToken, refreshToken }`
- 키 **`user`** = JSON `{ email, name, role, companyCode }` (`GET /api/auth/me` 응답 그대로 저장 — `companyName` 없음)
- `signOut()` = `token`·`user` 키 삭제 (로그아웃)
- `isAuthed = !!accessToken`
- `AuthContext` 재작성: 기존 단일 토큰(chokchok_token/email/name) 모델 → 위 2키 모델로 교체

## 5. Bearer 헤더 + RTR 인터셉터 (`api/client.ts`)

- **요청 인터셉터**: 저장된 accessToken을 **`Authorization: Bearer <accessToken>`** 로 모든 API 요청에 자동 첨부
- **응답 인터셉터(401)**: `/api/auth/refresh`(refreshToken)로 재발급 → 새 access+refresh 저장 → 원 요청 재시도
  - refresh도 실패 → `signOut()` + `/login` 이동
  - 동시 다발 401은 **큐잉**해서 refresh 1회만 수행 후 대기 요청 일괄 재시도
  - URL에 `/auth/`가 포함된 요청(`/api/auth/login`·`/api/auth/refresh`) 자체는 인터셉터 재시도 대상에서 제외(무한루프 방지)

## 5-1. 로그인 실패 처리

- 표시: **로그인 폼 내 인라인 오류 메시지**(`LoginForm`의 기존 `error` 슬롯 사용). 브라우저 `alert` 대신 폼 안 메시지로 — 필요 시 토스트로 확장 가능.
- 서버가 에러 봉투(`{error:{code,message}}`)를 주면 그 `message`를 그대로 노출(예: `INVALID_CREDENTIALS` → "이메일 또는 비밀번호가 올바르지 않습니다"). 응답이 없거나 네트워크 오류면 "로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."로 폴백.
- 프론트 입력 검증 실패(이메일/비번 규칙)는 API 호출 전에 같은 슬롯에 규칙 안내 메시지 표시.

## 6. 라우팅 · 가드

- `/login` 라우트 + `RequireAuth` 가드 **재활성화**(현재 확장판으로 비활성)
- 미인증으로 `/app/*` 접근 → `/login` 리다이렉트
- 인증 상태로 `/login` 접근 → `/app/dashboard` 리다이렉트
- 마이페이지 = `/app/mypage` — 사이드바 유저 영역(재활성) + 로그아웃 버튼에서 진입

## 7. 마이페이지 (`/app/mypage`)

- `/auth/me`로 받아온 정보 중 표시: **유저명 · 기업 코드** (`companyName`은 API에 없어 행 자체를 제거 — 기업코드와 중복 표시 방지)
- (플랜) 비밀번호 변경 섹션 — 후순위

## 8. 제거/정리

- `SignupForm.tsx` 삭제 + `Login/index.tsx`의 회원가입 상태·핸들러·`validateSignup` 제거
- `Login/index.tsx`의 `@ts-nocheck` 제거(실 연동 시 타입 정상화)
- `validateMessages.ts`의 `validateLogin` 복구(위 규칙으로), `validateSignup` 삭제

## 9. 검증 전략

- API 명세는 확정됐지만 백엔드 배포/구현 완료 여부는 미확인 — **성공 경로 실검증**(실제 로그인 성공, `/auth/me` 연동)은 백엔드 연동 후 진행.
- 지금 검증 가능한 것: 입력 검증(이메일/비번 규칙), 실패 시 오류 메시지(서버 `error.message` 기반), 라우트 가드(미인증→/login), 저장소 형태, 로그아웃, `tsc -b` 타입 정합성.

## 10. 영향 파일(예상)

- `src/api/client.ts` — Bearer 첨부 + RTR 인터셉터, 공통 에러 봉투 타입(`ApiErrorResponse`)
- `src/api/auth.ts`(신설) — `loginRequest`(토큰 전용 응답) · `fetchMe`(`GET /api/auth/me`)
- `src/api/tokenStore.ts`(신설) — 토큰·유저 정보 localStorage 저장/조회
- `src/context/AuthContext.tsx` — 로그인→`fetchMe()` 순차 호출 모델로 재작성
- `src/pages/Login/*` — 회원가입 삭제, 비번찾기 진입 숨김 유지, 로그인 검증 연결, 서버 에러 메시지 표시
- `src/pages/MyPage/*`(신설) — 마이페이지
- `src/components/layout/Sidebar.tsx` — 유저 영역·로그아웃·마이페이지 링크 재활성
- `src/components/layout/RequireAuth.tsx` + `App.tsx` — 라우트 가드/`/login`/`/app/mypage` 재활성
- `src/utils/validateMessages.ts` — validateLogin 복구, validateSignup 제거
