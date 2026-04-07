// ====================================================
// API 설정 - axios로 서버와 통신하는 함수들
// ====================================================
// 💡 axios란?
//    서버(Spring Boot 백엔드)에 데이터를 요청하거나
//    보낼 때 사용하는 라이브러리 (fetch의 편리한 버전)
// ====================================================

import axios from 'axios';

// ── axios 기본 설정 ──────────────────────────────
// baseURL: 모든 요청 앞에 자동으로 붙는 서버 주소
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000, // 10초 안에 응답 없으면 에러
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── 요청 인터셉터 (요청 보내기 전 자동 실행) ────
// Firebase 로그인 후 받은 토큰을 모든 요청에 자동 첨부
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('firebase_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── 알림 관련 API 함수들 ─────────────────────────
export const notificationAPI = {

  // userEmail 을 쿼리 파라미터로 전달
  getAll: (userEmail) => api.get('/notifications', { params: { userEmail } }),

  markAsRead: (id) => api.patch(`/notifications/${id}/read`),

  markAllRead: (userEmail) => api.patch('/notifications/read-all', null, { params: { userEmail } }),

  deleteAll: (userEmail) => api.delete('/notifications', { params: { userEmail } }),
};

export default api;
