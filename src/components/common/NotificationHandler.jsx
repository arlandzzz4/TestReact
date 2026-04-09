import { useEffect } from 'react';
import { setupOnMessageListener, requestForToken } from '@/api/fcm/fcmService';
import { useAuthStore } from '@/store/useAuthStore';

const NotificationHandler = ({ children }) => {
  const { user, accessToken } = useAuthStore();

  useEffect(() => {
    if (user && accessToken) {
      // 1. 로그인된 유저라면 토큰 요청 및 서버 등록
      requestForToken(accessToken).catch(console.error);

      // 2. 포그라운드 알림 리스너 작동
      const unsubscribe = setupOnMessageListener((payload) => {
        console.log('알림 도착:', payload);
        // 여기서 Toast를 띄우거나 브라우저 알림 호출
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: '/logo192.png',
        });
      });

      return () => unsubscribe(); // 언마운트 시 해제
    }
  }, [user, accessToken]);

  return children;
};

export default NotificationHandler;