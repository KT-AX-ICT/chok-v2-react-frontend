#!/bin/sh
# nginx:alpine 공식 이미지가 nginx 시작 전 /docker-entrypoint.d/*.sh 를 자동 실행해주는 훅.
# 빌드 시 박아둔 플레이스홀더를 컨테이너 실행 시점의 실제 환경변수 값으로 치환한다.
set -eu

find /usr/share/nginx/html -type f \( -name '*.js' -o -name '*.html' \) -print0 |
  xargs -0 sed -i \
    -e "s|__VITE_API_BASE_URL__|${VITE_API_BASE_URL:-http://localhost:8080}|g" \
    -e "s|__VITE_USE_MOCK__|${VITE_USE_MOCK:-false}|g"
