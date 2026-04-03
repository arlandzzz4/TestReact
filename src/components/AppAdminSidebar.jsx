/**
 * AppSidebar Component
 * 
 * Collapsible navigation sidebar with branding, menu items, and toggle controls.
 *
 * Features:
 * - Redux-controlled visibility state
 * - Unfoldable/narrow mode for more screen space
 * - Brand logo with full and narrow variants
 * - Close button for mobile devices
 * - Footer with toggle button
 * - Dark color scheme
 * - Fixed positioning
 *
 * @component
 * @example
 * return (
 *   <AppSidebar />
 * )
 */
import React, { useMemo } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'

import { AppAdminSidebarNav } from './AppAdminSidebarNav'

// sidebar nav config
import navigation from '../_navAdmin'

/**
 * AppSidebar functional component
 *
 * Manages sidebar state with Redux:
 * - sidebarShow: Controls sidebar visibility
 * - sidebarUnfoldable: Controls narrow/wide mode
 *
 * Renders navigation from _nav.js configuration file.
 * Memoized to prevent unnecessary re-renders.
 *
 * @returns {React.ReactElement} Sidebar with navigation
 */
const AppAdminSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const { isAuthenticated } = useAuth()

  // 로그인 상태에 따라 보여줄 메뉴를 필터링합니다.
  const filteredNav = useMemo(
    () =>
      navigation.filter((item) => {
        return isAuthenticated ? true : !item.auth
      }),
    [isAuthenticated],
  )

  return (
    <CSidebar
      className="border-end"
      // colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      {/* 사이드바 헤더 */}
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          {/* 사이드바가 펼쳐졌을 때 보일 전체 이름 */}
          <span
            className="sidebar-brand-full"
            style={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem', textDecoration: 'none' }}
          >
            IOB
          </span>
          <span
          style={{ color: 'white', fontSize: '0.8rem', textDecoration: 'none' }}
          > Information Of Balace</span>
          {/* 사이드바가 좁혀졌을 때 보일 축약 이름 */}
          <span className="sidebar-brand-narrow" style={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>
            I
          </span>
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      
      {/* 사이듣바 아이템 */}
      <AppAdminSidebarNav items={filteredNav} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppAdminSidebar)
