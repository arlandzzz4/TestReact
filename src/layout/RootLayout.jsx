// src/layout/RootLayout.jsx
import React, { Suspense } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import FullPageLoader from '@/components/common/FullPageLoader';

const RootLayout = () => {
  return (
    <div className="root-layout">

      <ScrollRestoration />

      <Suspense fallback={<FullPageLoader message="시스템을 불러오는 중입니다..." />}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default RootLayout;