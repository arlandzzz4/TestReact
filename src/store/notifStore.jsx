// ====================================================
// Zustand 스토어 - 알림 설정 상태 관리
// ====================================================
// 💡 Zustand란?
//    React에서 전역(앱 전체) 상태를 간단하게 관리하는 라이브러리
//    여러 컴포넌트에서 같은 데이터를 공유할 때 사용
// ====================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── 알림 설정 스토어 ─────────────────────────────
// persist: 브라우저 localStorage에 자동 저장/불러오기
export const useNotifSettingStore = create(
  persist(
    (set) => ({
      // 알림 타입별 ON/OFF 설정
      likeEnabled:    true,  // 좋아요 알림 ON
      commentEnabled: true,  // 댓글 알림 ON
      noticeEnabled:  true,  // 공지사항 알림 ON

      // 설정 변경 함수
      setLikeEnabled:    (val) => set({ likeEnabled: val }),
      setCommentEnabled: (val) => set({ commentEnabled: val }),
      setNoticeEnabled:  (val) => set({ noticeEnabled: val }),
    }),
    {
      name: 'iob-notif-settings', // localStorage에 저장될 키 이름
    }
  )
);

// ── 공지 배너 스토어 ──────────────────────────────
// 공지 배너를 오늘 닫았는지 여부 관리
export const useNoticeBannerStore = create(
  persist(
    (set) => ({
      dismissedDate: null, // 닫은 날짜 (없으면 null)

      // 오늘 날짜로 닫음 처리
      dismiss: () => set({ dismissedDate: new Date().toDateString() }),

      // 오늘 닫혔는지 확인하는 함수 (getter)
      isDismissedToday: (state) =>
        state.dismissedDate === new Date().toDateString(),
    }),
    {
      name: 'iob-notice-banner',
    }
  )
);
