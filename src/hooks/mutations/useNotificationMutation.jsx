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