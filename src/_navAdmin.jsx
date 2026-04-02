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
  cilDelete,
  cilReportSlash,
  cilCommentBubble,
  cilUser,
  cilMonitor,
  cilClipboard,
} from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _navAdmin = [
  {
    component: CNavItem,
    name: '대시보드',
    to: '/admin/dashboard',
    icon: <CIcon icon={cilMonitor} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '회원관리',
    to: '/admin/user',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '게시글 관리',
    to: '/admin/post',
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '댓글 관리',
    to: '/admin/comment',
    icon: <CIcon icon={cilCommentBubble} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '신고 관리',
    to: '/admin/report',
    icon: <CIcon icon={cilReportSlash} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '삭제 관리',
    to: '/admin/delete',
    icon: <CIcon icon={cilDelete} customClassName="nav-icon" />,
  },
]

export default _navAdmin
