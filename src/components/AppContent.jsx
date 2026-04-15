// src/components/AppContent.jsx
import React, { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

const AppContent = () => {
  const location = useLocation()
  const { pathname } = location

  // 게시글 상세, 작성, 수정, 계산기 페이지 경로 확인
  const isPostDetailPage = /^\/post\/\d+$/.test(pathname)
  const isWritePage = pathname === '/write'
  const isEditPage = /^\/post\/edit\/\d+$/.test(pathname)
  const isCalcPage = pathname === '/calc'
  const isChallengePage = pathname === '/challenge'

  // 해당 페이지들인지 여부 확인
  const isSpecialPage = isPostDetailPage || isWritePage || isEditPage || isCalcPage || isChallengePage


  // isSpecialPage일 경우 모바일=> 좌우 패딩 없앰, 그 이상에서는 패딩 유지하게.
  const containerClassName = isSpecialPage ? 'px-0 px-md-4' : 'px-4'

  return (
    <CContainer className={containerClassName} lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Outlet />
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)