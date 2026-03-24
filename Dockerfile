# 1단계: 빌드 (Node.js 환경)
FROM node:20-alpine AS build

# [변경 이유]: 기본값이 'development'일 경우, CI/CD 파이프라인이나 수동 빌드 시 
# 별도의 인자를 주지 않으면 무거운 개발용 번들로 실서버에 배포되는 대참사가 발생합니다.
# 실서버 배포용 Dockerfile이므로 기본값을 'production'으로 변경하여 안전을 확보합니다.
ARG BUILD_MODE=production
ENV BUILD_MODE=${BUILD_MODE}

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN echo "현재 빌드 모드: ${BUILD_MODE}"
RUN npm run build -- --mode ${BUILD_MODE}

# 2단계: 실행 (Nginx 환경)
FROM nginx:stable-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
# 이미지 내부에 설정을 영구 박제합니다.
COPY nginx/main.conf /etc/nginx/conf.d/default.conf
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]