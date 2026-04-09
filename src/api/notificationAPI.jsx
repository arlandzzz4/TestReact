import { instance } from './axios.jsx';

export const notificationAPI = {

  getAll: (userEmail) => instance.get('/api/notifications', { params: { userEmail } }),

  markAsRead: (id) => instance.patch(`/api/notifications/${id}/read`),

  markAllRead: (userEmail) => instance.patch('/api/notifications/read-all', null, { params: { userEmail } }),

  deleteAll: (userEmail) => instance.delete('/api/notifications', { params: { userEmail } }),

  // 알림 설정 조회
  getSettings: (userEmail) => instance.get('/api/notifications/settings', { params: { userEmail } }),

  // 알림 설정 수정
  updateSettings: (userEmail, likeYn, commentYn, noticeYn) =>
    instance.patch('/api/notifications/settings', null, {
      params: { userEmail, likeYn, commentYn, noticeYn }
    }),
};

export default instance;