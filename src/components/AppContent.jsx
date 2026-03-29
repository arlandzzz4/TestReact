/**
 * AppContent Component
 *
 * Main content area that renders routes defined in routes.js.
 * Handles lazy loading with Suspense and provides a loading spinner
 * while components are being loaded.
 *
 * Features:
 * - Renders Data Router's Outlet
 * - Suspense boundary for lazy-loaded route components
 * - Loading spinner fallback during component load
 *
 * @component
 * @example
 * return (
 *   <AppContent />
 * )
 */

import React, { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

/**
 * AppContent functional component
 *
 * Renders all application routes within a container with:
 * - Suspense for lazy-loaded Outlet components
 * - Spinner shown during component loading
 *
 * Memoized to prevent unnecessary re-renders when parent updates.
 *
 * @returns {React.ReactElement} Content container with Outlet views
 */
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
