// ====================================================
// NotificationPage.jsx - 알림 페이지 메인 컴포넌트
// ====================================================
// 세팅값 적용:
//  UI      → CoreUI + Bootstrap 5 클래스 병행
//  스타일  → SCSS (_variables.scss 변수 사용)
//  API     → axios + TanStack Query (useNotifications 훅)
//  상태    → Zustand (알림 설정 ON/OFF, 배너 닫기)
//  라우팅  → react-router-dom v7 (useNavigate)
// ====================================================

// TanStack Query 훅 (서버 데이터)
import { useNotifications } from '../../hooks/queries/useNotificationQuery';
import { useMarkAsRead, useMarkAllRead, useDeleteAll } from '../../hooks/mutations/useNotificationMutation';

// Zustand 스토어 (배너용)
import { useNoticeBannerStore } from '../../store/notifStore';

// SCSS 스타일
import '../../scss/NotificationPage.scss';

// ── 메인 컴포넌트 ────────────────────────────────
export default function NotificationPage() {

  // ── 서버 데이터 (TanStack Query) ──────────────
  const { data: notifications = [], isLoading, isError } = useNotifications();
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllRead } = useMarkAllRead();
  const { mutate: deleteAll } = useDeleteAll();

  const { dismissedDate, dismiss } = useNoticeBannerStore();
  const bannerDismissed = dismissedDate === new Date().toDateString();

  // ── 날짜 섹션별 분류 ──────────────────────────
  const sections = [
    { id: 'today', label: '오늘' },
    { id: 'yesterday', label: '어제' },
    { id: 'old', label: '이전' },
  ];

  // ── 전체 삭제 핸들러 ──────────────────────────
  const handleDeleteAll = () => {
    if (window.confirm('알림을 전체 삭제하시겠습니까?')) {
      deleteAll();
    }
  };

  // 필터링 없이 전체 알림 표시
  const visibleNotifs = notifications;

  // ── 미읽음 개수 ─────────────────────────────── 
  const unreadCount = visibleNotifs.filter((n) => !n.isRead).length;

  // ── 로딩/에러 처리 ────────────────────────────
  if (isLoading) return <div className="empty-state">알림을 불러오는 중...</div>;
  if (isError) return <div className="empty-state">알림을 불러오지 못했습니다.</div>;

  return (
    <div className="notification-page">



      {/* ══ 메인 콘텐츠 ════════════════════════════ */}
      <main className="notif-main">

        {/* 상단: 타이틀 + 모두읽음/전체삭제 버튼 */}
        <div className="notif-top">
          <h1 className="notif-title">
            알림
            {unreadCount > 0 && (
              <span className="notif-count">{unreadCount}</span>
            )}
          </h1>
          <div className="notif-actions">
            <button className="notif-action-btn" onClick={() => markAllRead()}>
              모두 읽음
            </button>
            <button className="notif-action-btn" onClick={handleDeleteAll}>
              전체 삭제
            </button>
          </div> {/* notif-actions 닫기 */}
        </div> {/* notif-top 닫기 */}


        {/* 공지 배너 (오늘 닫으면 하루 안 보임) */}
        {!bannerDismissed && (
          <div className="notice-banner">
            <div className="notice-banner-icon">📢</div>
            <div className="notice-banner-body">
              <div className="notice-banner-label">NOTICE</div>
              <div className="notice-banner-text">
                <strong>IOB 서비스 업데이트 안내.</strong>{' '}
                새로운 지도/매칭 기능이 출시되었습니다. 지금 바로 확인해보세요!
              </div>
              <div className="notice-banner-time">오늘</div>
            </div>
            <button className="notice-banner-close" onClick={dismiss}>×</button>
          </div>
        )}

        {/* 알림이 하나도 없을 때 */}
        {visibleNotifs.length === 0 ? (
          <div className="empty-state">알림이 없습니다.</div>
        ) : (
          /* 날짜별 섹션 */
          sections.map((section) => {
            // 해당 섹션에 속하는 알림만 필터링
            const sectionItems = visibleNotifs.filter((n) => n.section === section.id);
            if (sectionItems.length === 0) return null; // 해당 섹션 아이템 없으면 숨김

            return (
              <div className="day-section" key={section.id}>
                <div className="day-label">{section.label}</div>

                {sectionItems.map((notif) => (
                  <NotifItem
                    key={notif.id}
                    notif={notif}
                    onRead={() => markAsRead(notif.id)}
                  />
                ))}
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}

// ── 알림 아이템 컴포넌트 (분리해서 가독성↑) ─────
function NotifItem({ notif, onRead }) {
  const handleClick = () => {
    if (!notif.isRead) onRead();
  };

  // 타입 뱃지 아이콘 결정
  const typeDotIcon = {
    like: '♥',
    comment: '💬',
    reply: '💬',
    notice: '!',
  }[notif.type] ?? '•';

  return (
    <div
      className={`notif-item ${notif.isRead ? 'read' : 'unread'}`}
      data-type={notif.type}
      onClick={handleClick}
    >
      {/* 아바타 */}
      <div className="notif-avatar-wrap">
        <div className={`notif-avatar ${notif.avatarColor}`}>
          {notif.actorInitial}
        </div>
        <div className={`notif-type-dot type-${notif.type}`}>
          {typeDotIcon}
        </div>
      </div>

      {/* 본문 */}
      <div className="notif-body">
        <div
          className="notif-text"
          /* 💡 dangerouslySetInnerHTML: 서버에서 받은 HTML 문자열을 그대로 렌더링
               백엔드 데이터에 <b> 태그가 포함된 경우 사용 (XSS 주의) */
          dangerouslySetInnerHTML={{
            __html: `<strong>${notif.actorName}</strong>${notif.message}${notif.quoted ? ` <span class="quoted">${notif.quoted}</span>` : ''
              }`,
          }}
        />
        <div className="notif-time">{notif.time}</div>
      </div>

      {/* 썸네일 (있을 때만) */}
      {notif.thumbnail && (
        <div className="notif-thumb">
          <span className="thumb-placeholder">{notif.thumbnail}</span>
        </div>
      )}

      {/* 미읽음 점 */}
      {!notif.isRead && <div className="unread-dot"></div>}
    </div>
  );
}
