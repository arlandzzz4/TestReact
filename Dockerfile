# 1단계: 빌드 (Node.js 환경)
FROM node:20-alpine AS build

# ★ 반드시 FROM 바로 다음에 위치해야 합니다 ★
ARG BUILD_MODE
# 값이 정말 들어오는지 로그로 확인 (빌드 시 출력됨)
RUN echo "전달된 빌드 모드: ${BUILD_MODE}"

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# 만약 ${BUILD_MODE}가 비어있다면 Vite가 에러를 내므로 직접 확인
RUN npm run build -- --mode ${BUILD_MODE}

# 2단계: 실행 (Nginx 환경)
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]