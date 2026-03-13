# 1단계: 빌드 (Node.js 환경)
ARG BUILD_MODE=development

FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --mode ${BUILD_MODE}

# 2단계: 실행 (Nginx 환경)
FROM nginx:stable-alpine
# 빌드된 결과물을 nginx의 실행 폴더로 복사
COPY --from=build /app/dist /usr/share/nginx/html
# 만약 React Router를 쓴다면 필요한 설정 (아래 2번 참고)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]