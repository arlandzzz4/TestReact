import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// 초기 로딩에 포함되지 않도록 각 페이지를 개별 청크(Chunk)로 분리합니다.
const Home = lazy(() => import('@/pages/home/Home'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'));
const MyPage = lazy(() => import('@/pages/user/MyPage'));
const NotFound = lazy(() => import('@/pages/error/NotFound'));

// 페이지 로딩 중에 보여줄 가벼운 스피너나 스켈레톤
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function AppRouter() {
  return (
    /* App.jsx에도 Suspense가 있지만, 페이지 전환 시마다 
       전체 화면이 깜빡이는 것을 방지하기 위해 라우터 내부에도 배치합니다. */
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* 공통 경로 */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* 대시보드 및 마이페이지 (인증이 필요한 구간) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mypage" element={<MyPage />} />

        {/* 404 페이지 처리 */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;