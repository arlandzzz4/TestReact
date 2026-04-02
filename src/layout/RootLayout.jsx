// src/layout/RootLayout.jsx
import React, { Suspense, useEffect } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import FullPageLoader from '@/components/common/FullPageLoader';

const RootLayout = () => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // 화면 이동 시마다 로그 출력
    console.group(`[화면 이동] ${new Date().toLocaleTimeString()}`);
    console.log(`경로: ${location.pathname}`);
    console.log(`로그인 상태: ${!!user}`);
    console.log('사용자 정보: ', user);
    console.groupEnd();
  }, [location, user]);

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