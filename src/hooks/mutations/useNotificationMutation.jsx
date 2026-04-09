import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationAPI } from '../../api/notificationAPI';
import { useAuthStore } from '@/store/useAuthStore';
import { NOTIFICATION_QUERY_KEYS } from '../queries/useNotificationQuery';

// 단일 알림 읽음 처리
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => notificationAPI.markAsRead(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(NOTIFICATION_QUERY_KEYS.notifications, (old) =>
        old?.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    },
  });
}

// 전체 읽음 처리
export function useMarkAllRead() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: () => notificationAPI.markAllRead(user.email),
    onSuccess: () => {
      queryClient.setQueryData(NOTIFICATION_QUERY_KEYS.notifications, (old) =>
        old?.map((n) => ({ ...n, isRead: true }))
      );
    },
  });
}

// 전체 삭제
export function useDeleteAll() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: () => notificationAPI.deleteAll(user.email),
    onSuccess: () => {
      queryClient.setQueryData(NOTIFICATION_QUERY_KEYS.notifications, []);
    },
  });
}

// 알림 설정 수정
export function useUpdateSettings() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ likeYn, commentYn, noticeYn }) =>
      notificationAPI.updateSettings(user.email, likeYn, commentYn, noticeYn),
    onSuccess: () => {
      // ✅ 추가 - 설정 캐시 무효화해서 최신 데이터 다시 조회
      queryClient.invalidateQueries(NOTIFICATION_QUERY_KEYS.settings);
    },
  });
}