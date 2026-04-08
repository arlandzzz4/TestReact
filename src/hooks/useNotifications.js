import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationAPI } from '../api/notificationAPI';
import { useAuthStore } from '@/store/useAuthStore';

const QUERY_KEYS = {
  notifications: ['notifications'],
};

// 백엔드 데이터 → React에서 쓰는 형태로 변환
function transformNotification(n) {
  // 오늘/어제/이전 분류
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
    // 보낸 사람 이름 (이메일 앞부분 사용)
    actorName: n.senderEmail ? n.senderEmail.split('@')[0] : 'IOB',
    actorInitial: n.senderEmail ? n.senderEmail[0].toUpperCase() : 'I',
    avatarColor: 'avatar-green', // 기본값
    time: section === 'today' ? '오늘' : section === 'yesterday' ? '어제' : '이전',
  };
}

// ── 알림 목록 조회 훅 ────────────────────────────
export function useNotifications() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: QUERY_KEYS.notifications,
    queryFn: async () => {
      const response = await notificationAPI.getAll(user.email);
      return response.data.map(transformNotification); // ← 변환 추가!
    },
    enabled: !!user,
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
        old?.map((n) => (n.id === id ? { ...n, isRead: true } : n))
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
        old?.map((n) => ({ ...n, isRead: true }))
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