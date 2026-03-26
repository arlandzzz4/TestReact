import React from 'react'
// 기존 주석과 import 유지
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

/**
 * DefaultLayout functional component
 *
 * Renders the main application layout with:
 * - Fixed sidebar navigation
 * - Sticky header
 * - Flexible content area
 * - Footer at bottom
 *
 * Uses flexbox for proper content stretching and footer positioning.
 *
 * @returns {React.ReactElement} Complete application layout
 */
const DefaultLayout = () => {
  return (
    <div className="wrapper d-flex flex-column min-vh-100">
      {/* 상단 헤더 */}
      <AppHeader className="app-header w-100" />

      {/* 본문 영역: 사이드바 + 메인 컨텐츠 */}
      <div className="body flex-grow-1 d-flex">
        {/* 사이드바 */}
        <AppSidebar />

        {/* 메인 컨텐츠 */}
        <div className="main-content flex-grow-1 d-flex justify-content-start align-items-start p-3">
          <AppContent />
        </div>
      </div>

      {/* 푸터 */}
      <AppFooter />
    </div>
  )
}

export default DefaultLayout