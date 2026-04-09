/**
 * AppHeader Component
 *
 * Main application header with navigation, theme switcher, and user menu.
 * Features include:
 * - Sidebar toggle button
 * - Primary navigation links
 * - Notification and action icons
 * - Theme switcher (light/dark/auto)
 * - User dropdown menu
 * - Breadcrumb navigation
 * - Sticky positioning with scroll shadow effect
 *
 * @component
 * @example
 * return (
 *   <AppHeader />
 * )
 */

import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
  CButton,
  CBadge,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
} from "@coreui/icons";

import { useLogoutMutation } from "@/hooks/mutations/useAuthMutation";
import { useAuth } from "@/hooks/useAuth";
import { useNotificationSettings } from '@/hooks/queries/useNotificationQuery';
import { useUpdateSettings } from '@/hooks/mutations/useNotificationMutation';

/**
 * AppHeader functional component
 *
 * Manages header UI including:
 * - Redux integration for sidebar state
 * - Theme management with CoreUI useColorModes hook
 * - Scroll-based shadow effect
 * - Responsive navigation
 *
 * @returns {React.ReactElement} Header component with navigation and controls
 */
const AppHeader = () => {
  const [settingOpen, setSettingOpen] = useState(false);
  const settingRef = useRef(null);
  const { data: settings } = useNotificationSettings();
  const { mutate: updateSettings } = useUpdateSettings();
  const likeEnabled = settings?.like_yn !== 'N';
  const commentEnabled = settings?.comment_yn !== 'N';
  const noticeEnabled = settings?.notice_yn !== 'N';
  const { user, isAuthenticated, isAdmin, isAuthLoading } = useAuth();

  const headerRef = useRef();
  const { colorMode, setColorMode } = useColorModes(
    "coreui-free-react-admin-template-theme",
  );

  const location = useLocation();
  const isWritePage = location.pathname === "/write";
  const isNotificationPage = location.pathname === '/notifications';

  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);

  const { mutate: logoutMutate } = useLogoutMutation();
  const handleLogout = () => {
    if (!user) {
      console.warn("로그인 정보가 없어 바로 클라이언트 로그아웃을 진행합니다.");
    }
    const logoutData = {
      email: user?.email,
      fcmToken: user?.fcmToken,
      providerCode: user?.providerCode,
      providerId: user?.providerId,
    };
    logoutMutate(logoutData);
  };

  useEffect(() => {
    const handleScroll = () => {
      headerRef.current &&
        headerRef.current.classList.toggle(
          "shadow-sm",
          document.documentElement.scrollTop > 0,
        );
    };

    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <CHeader
      position="sticky"
      className={isWritePage ? "p-0" : "mb-4 p-0"}
      ref={headerRef}
    >
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: "set", sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: "-14px" }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav className="header-nav-menu nav-underline">
          <h4 style={{ color: "#3D6B4F", marginRight: "50px" }}>
            <b>IOB</b>
          </h4>
          <CNavItem>
            <CNavLink to="/feed" as={NavLink}>
              홈
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink to="/calendar" as={NavLink}>
              캘린더
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink to="/foodSearch" as={NavLink}>
              음식 검색
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink to="/calc" as={NavLink}>
              계산기
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink to="/map" as={NavLink}>
              지도/루트
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink to="/challenge" as={NavLink}>
              챌린지
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-auto">
          {isAuthenticated ? (
            <div className="d-flex align-items-center gap-3">
              <CNavLink
                as={NavLink}
                to="/notifications"
                className="position-relative text-decoration-none"
                style={{
                  cursor: "pointer",
                  fontSize: "24px",
                  lineHeight: 1,
                  padding: "4px 8px",
                }}
              >
                🔔
              </CNavLink>
              {/* ⚙️ 설정 버튼 - 알림 페이지에서만 표시 */}
              {isNotificationPage && (
                <div style={{ position: "relative" }} ref={settingRef}>
                  <button
                    onClick={() => setSettingOpen((prev) => !prev)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "#ede9df",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "15px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ⚙️
                  </button>

                  {settingOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: 40,
                        right: 0,
                        background: "#fff",
                        border: "1px solid #e0ddd4",
                        borderRadius: 14,
                        padding: "1rem 1.25rem",
                        width: 220,
                        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                        zIndex: 100,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          marginBottom: 10,
                        }}
                      >
                        알림 설정
                      </div>

                      {[
                        { label: "좋아요 알림", color: "#e05050", key: "like" },
                        { label: "댓글 알림", color: "#4a90d9", key: "comment" },
                        {
                          label: "공지사항 알림",
                          color: "#2d5a27",
                          key: "notice",
                        },
                      ].map(({ label, color, key }) => (
                        <div
                          key={key}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "7px 0",
                            borderBottom: "1px solid #f5f2eb",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              fontSize: 12,
                              color: "#555",
                            }}
                          >
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: color,
                                display: "inline-block",
                              }}
                            ></span>
                            {label}
                          </div>
                          <label
                            style={{
                              position: "relative",
                              width: 34,
                              height: 18,
                              display: "inline-block",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={
                                key === "like"
                                  ? likeEnabled
                                  : key === "comment"
                                    ? commentEnabled
                                    : noticeEnabled
                              }
                              onChange={(e) => {
                                updateSettings({
                                  likeYn: key === 'like' ? (e.target.checked ? 'Y' : 'N') : (likeEnabled ? 'Y' : 'N'),
                                  commentYn: key === 'comment' ? (e.target.checked ? 'Y' : 'N') : (commentEnabled ? 'Y' : 'N'),
                                  noticeYn: key === 'notice' ? (e.target.checked ? 'Y' : 'N') : (noticeEnabled ? 'Y' : 'N'),
                                });
                              }}
                              style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span
                              style={{
                                position: "absolute",
                                inset: 0,
                                background: (
                                  key === "like"
                                    ? likeEnabled
                                    : key === "comment"
                                      ? commentEnabled
                                      : noticeEnabled
                                )
                                  ? "#2d5a27"
                                  : "#d8d4cb",
                                borderRadius: 18,
                                cursor: "pointer",
                                transition: "background 0.2s",
                              }}
                            >
                              <span
                                style={{
                                  position: "absolute",
                                  width: 13,
                                  height: 13,
                                  left: (
                                    key === "like"
                                      ? likeEnabled
                                      : key === "comment"
                                        ? commentEnabled
                                        : noticeEnabled
                                  )
                                    ? 18
                                    : 3,
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  background: "#fff",
                                  borderRadius: "50%",
                                  transition: "left 0.2s",
                                }}
                              ></span>
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {/* 유저 프로필 동그라미 (클릭 시 마이페이지 이동) */}
              <CNavLink
                as={NavLink}
                to="/mypage"
                title={`${user?.nickname}님의 마이페이지`}
                className="text-decoration-none"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #d4e8db, #6aab81)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#3d6b4f",
                  flexShrink: 0,
                  border: "none",
                }}
              >
                {user?.nickname ? user.nickname[0] : "U"}
              </CNavLink>
              <CButton
                onClick={handleLogout}
                style={{
                  backgroundColor: "#f0f0f0",
                  color: "#5c5c5c",
                  border: "1px solid #e1e1e1",
                  borderRadius: "40px",
                }}
              >
                Logout
              </CButton>
            </div>
          ) : (
            <CButton to="/login" as={NavLink} color="green">
              Join Us
            </CButton>
          )}
          {isAdmin && (
            <CButton
              to="/admin/dashboard"
              as={NavLink}
              color="green"
              style={{ marginLeft: "10px" }}
            >
              관리자
            </CButton>
          )}
        </CHeaderNav>
      </CContainer>
    </CHeader>
  );
};

export default AppHeader;
