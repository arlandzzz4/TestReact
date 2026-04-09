import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('firebase_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const notificationAPI = {

  getAll: (userEmail) => api.get('/notifications', { params: { userEmail } }),

  markAsRead: (id) => api.patch(`/notifications/${id}/read`),

  markAllRead: (userEmail) => api.patch('/notifications/read-all', null, { params: { userEmail } }),

  deleteAll: (userEmail) => api.delete('/notifications', { params: { userEmail } }),

  // 알림 설정 조회
  getSettings: (userEmail) => api.get('/notifications/settings', { params: { userEmail } }),

  // 알림 설정 수정
  updateSettings: (userEmail, likeYn, commentYn, noticeYn) =>
    api.patch('/notifications/settings', null, {
      params: { userEmail, likeYn, commentYn, noticeYn }
    }),
};

export default api;