// src/components/AppContent.jsx
import React, { Suspense } from 'react'
import { Outlet } from 'react-router-dom' // 👈 Routes 대신 Outlet 사용!
import { CContainer, CSpinner } from '@coreui/react'

const AppContent = () => {
  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Outlet /> 
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)