# Node로 빌드 → Nginx로 정적 파일 서빙.
# 이미지는 커밋 1개당 한 번만 빌드돼 여러 환경(EC2 등)에 재사용되므로,
# VITE_* 값은 빌드 시점엔 플레이스홀더로 박아두고 컨테이너 시작 시(entrypoint) 실제 값으로 치환한다.

FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV VITE_API_BASE_URL=__VITE_API_BASE_URL__
ENV VITE_USE_MOCK=__VITE_USE_MOCK__
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/env-substitute.sh /docker-entrypoint.d/30-env-substitute.sh
RUN chmod +x /docker-entrypoint.d/30-env-substitute.sh

EXPOSE 80
