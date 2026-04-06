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

import React, { useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'

import { useLogoutMutation } from '../hooks/mutations/useAuthMutation'
import { useAuth } from '@/hooks/useAuth'


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
  const { user, isAuthenticated, isAdmin, isAuthLoading } = useAuth();
  
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const location = useLocation()
  const isWritePage = location.pathname === '/write'

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const { mutate: logoutMutate } = useLogoutMutation();
  const handleLogout = () => {
    if (!user) {
      console.warn("로그인 정보가 없어 바로 클라이언트 로그아웃을 진행합니다.");
    }

    logoutMutate(user); 
  };

  useEffect(() => {
    const handleScroll = () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    }

    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <CHeader position="sticky" className={isWritePage ? 'p-0' : 'mb-4 p-0'} ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav className="d-none d-md-flex nav-underline">

          <h4 style={{ color: "#3D6B4F", marginRight: "50px"}}><b>IOB</b></h4>
          <CNavItem>
            <CNavLink to="/feed" as={NavLink}>
              홈
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink to="/calendar" as={NavLink}>캘린더</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink to="/foodSearch" as={NavLink}>음식 검색</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink to="/calc" as={NavLink}>계산기</CNavLink>
          </CNavItem>
          <CNavItem>
             <CNavLink to="/map" as={NavLink}>
              지도/루트
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink to="/challenge" as={NavLink}>챌린지</CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className='ms-auto'>
          {isAuthenticated ?
          <div className="d-flex align-items-center gap-3">
            <CNavLink
              as={NavLink}
              to="/notifications"
              className="position-relative text-decoration-none" 
              style={{ 
                cursor: 'pointer', 
                fontSize: '24px', 
                lineHeight: 1, 
                padding: '4px 8px' 
              }}>
              🔔
            </CNavLink>
            {/* 유저 프로필 동그라미 (클릭 시 마이페이지 이동) */}
            <CNavLink
              as={NavLink}
              to="/mypage"
              title={`${user?.nickname}님의 마이페이지`}
              className="text-decoration-none"
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #d4e8db, #6aab81)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 700,
                color: '#3d6b4f',
                flexShrink: 0,
                border: 'none',
              }}
            >
              {user?.nickname ? user.nickname[0] : 'U'}
            </CNavLink>
            <CButton onClick={handleLogout}
                     style={{ backgroundColor: '#f0f0f0', color: '#5c5c5c', border: '1px solid #e1e1e1', borderRadius: '40px'}}
            >Logout</CButton>
          </div>

          : <CButton to="/login" as={NavLink}
                    color="green"
                        >Join Us</CButton>
          }
          {isAdmin && (
            <CButton 
              to="/admin/dashboard" as={NavLink}
              color="green"
              style={{ marginLeft: '10px' }}
            >
              관리자
            </CButton>
          )}
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
