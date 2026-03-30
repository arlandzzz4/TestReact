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
  cilStar,
} from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: '홈',
    to: '/feed',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '캘린더',
    to: '/calendar',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
    auth: true, // << 인증 필요 표시. AppSidebar.jsx에서 이 항목을 읽어 true일 시 > 로그인 전이면 비표시, 로그인후면 표시하도록 함
  },
  {
    component: CNavItem,
    name: '음식 검색',
    to: '/foodSearch',
    icon: <CIcon icon={cilSearch} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '계산기',
    to: '/calc',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '지도/루트',
    to: '/map',
    icon: <CIcon icon={cilMap} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '챌린지',
    to: '/challenge',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    auth: true, //<< 인증 필요
  },
]

export default _nav
