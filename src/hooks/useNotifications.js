import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationAPI } from '../api/notificationAPI';
import { useAuthStore } from '@/store/useAuthStore';

const QUERY_KEYS = {
  notifications: ['notifications'],
};

// ── 알림 목록 조회 훅 ────────────────────────────
export function useNotifications() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: QUERY_KEYS.notifications,
    queryFn: async () => {
      const response = await notificationAPI.getAll(user.email);
      return response.data;
    },
    enabled: !!user, // 로그인한 경우에만 요청
    staleTime: 1000 * 60,
  });
}

// ── 단일 알림 읽음 처리 훅 ───────────────────────
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => notificationAPI.markAsRead(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(QUERY_KEYS.notifications, (old) =>
        old?.map((n) => (n.notiId === id ? { ...n, readYn: 'Y' } : n))
      );
    },
  });
}

// ── 전체 읽음 처리 훅 ────────────────────────────
export function useMarkAllRead() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: () => notificationAPI.markAllRead(user.email),
    onSuccess: () => {
      queryClient.setQueryData(QUERY_KEYS.notifications, (old) =>
        old?.map((n) => ({ ...n, readYn: 'Y' }))
      );
    },
  });
}

// ── 전체 삭제 훅 ─────────────────────────────────
export function useDeleteAll() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: () => notificationAPI.deleteAll(user.email),
    onSuccess: () => {
      queryClient.setQueryData(QUERY_KEYS.notifications, []);
    },
  });
}