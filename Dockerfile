# 1단계: 빌드 (Node.js 환경)
FROM node:20-alpine AS build
WORKDIR /app

# 빌드 시점에 외부(GitHub Actions)에서 넘겨받을 변수 선언
ARG BUILD_MODE

COPY package*.json ./
RUN npm install
COPY . .

# 위에서 선언한 ARG를 사용하여 빌드 실행
RUN npm run build -- --mode ${BUILD_MODE}

# 2단계: 실행 (Nginx 환경)
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]