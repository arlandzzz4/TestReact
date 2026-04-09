import { useQuery } from '@tanstack/react-query';
import { notificationAPI } from '../../api/notificationAPI';
import { useAuthStore } from '@/store/useAuthStore';

export const NOTIFICATION_QUERY_KEYS = {
  notifications: ['notifications'],
  settings: ['notificationSettings'],
};

// 백엔드 데이터 → React에서 쓰는 형태로 변환
export function transformNotification(n) {
  const now = new Date();
  const created = new Date(n.createdAt);
  const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
  const section = diffDays === 0 ? 'today' : diffDays === 1 ? 'yesterday' : 'old';

  return {
    id: n.notiId,
    type: n.notiType,
    senderEmail: n.senderEmail,
    message: n.message,
    targetId: n.targetId,
    isRead: n.readYn === 'Y',
    createdAt: n.createdAt,
    section,
    actorName: n.senderEmail ? n.senderEmail.split('@')[0] : 'IOB',
    actorInitial: n.senderEmail ? n.senderEmail[0].toUpperCase() : 'I',
    avatarColor: 'avatar-green',
    time: section === 'today' ? '오늘' : section === 'yesterday' ? '어제' : '이전',
  };
}

// 알림 목록 조회
export function useNotifications() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.notifications,
    queryFn: async () => {
      const response = await notificationAPI.getAll(user.email);
      return response.data.map(transformNotification);
    },
    enabled: !!user,
    staleTime: 0,        //  0으로 변경 (항상 최신 데이터 요청)
    refetchOnMount: true, //  추가 (페이지 진입할 때마다 새로 fetch)
  });
}

// 알림 설정 조회
export function useNotificationSettings() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.settings,
    queryFn: async () => {
        const response = await notificationAPI.getSettings(user.email);
        return response.data;
    },
    enabled: !!user,
    staleTime: 0,
    refetchOnMount: true,
  });
}