/**
 * Sidebar Navigation Configuration
 *
 * Defines the structure and content of the sidebar navigation menu.
 * Supports multiple navigation component types from CoreUI React:
 * - CNavItem: Single navigation link
 * - CNavGroup: Collapsible group of links
 * - CNavTitle: Section title/divider
 *
 * @module _nav
 */

import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilHome,
  cilCalendar,
  cilSearch,
  cilCalculator,
  cilMap,
} from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _navAdmin = [
  {
    component: CNavItem,
    name: '대시보드',
    to: '/admin/dashboard',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '회원관리',
    to: '/admin/users',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
    auth: true, // << 인증 필요 표시. AppSidebar.jsx에서 이 항목을 읽어 true일 시 > 로그인 전이면 비표시, 로그인후면 표시하도록 함
  },
  {
    component: CNavItem,
    name: '신고 관리',
    to: '/admin/reports',
    icon: <CIcon icon={cilSearch} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '게시글 관리',
    to: '/admin/posts',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '사이트 설정',
    to: '/admin/settings',
    icon: <CIcon icon={cilMap} customClassName="nav-icon" />,
  },
]

export default _navAdmin
