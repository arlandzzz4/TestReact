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

import { AppHeaderDropdown } from './header/index'
import { useAuthStore } from '@/store/useAuthStore';
import { useLogoutMutation } from '@/hooks/mutations/useAuthMutation';

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
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const location = useLocation()
  const isWritePage = location.pathname === '/write'

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const user = useAuthStore((state) => state.user);
  const isLoggedIn = !!user;

  const { mutate: logoutMutate } = useLogoutMutation();

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
          {isLoggedIn ?
          <CButton onClick={() => logoutMutate()}
                    style={{ backgroundColor: '#e1e1e1', color: 'black', border: 'none' }}
                        >Logout</CButton>
          : <CButton to="/login" as={NavLink}
                    color="green"
                        >Join Us</CButton>
          }
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
