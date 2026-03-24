# 1단계: 빌드 (Node.js 환경)
FROM node:20-alpine AS build

# 1. ARG를 선언합니다. (기본값으로 development 설정)
ARG BUILD_MODE=development

# 2. ARG 값을 컨테이너 내부 환경 변수(ENV)로 복사합니다. (Vite 빌드 시 확실히 인식하게 함)
ENV BUILD_MODE=${BUILD_MODE}

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# 3. 환경 변수 확인용 로그 (출력 결과 확인 필수)
RUN echo "현재 빌드 모드: ${BUILD_MODE}"

# 4. 빌드 실행
RUN npm run build -- --mode ${BUILD_MODE}

# 2단계: 실행 (Nginx 환경)
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]