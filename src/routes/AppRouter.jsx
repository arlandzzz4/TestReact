import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

/**
 * lazy 로딩 방식의 간소화
 */

// 페이지 로더 컴포넌트
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// 라우터 구성 객체
const router = createBrowserRouter([
  {
    path: '/',
    lazy: async () => {
      const { default: Home } = await import('@/pages/home/Home');
      return { Component: Home };
    },
  },
  {
    path: '/login',
    lazy: async () => {
      const { default: Login } = await import('@/pages/auth/Login');
      return { Component: Login };
    },
  },
  // 2. 관리자 전용 페이지 그룹 (중첩 라우팅)
  {
    path: '/admin',
    // 관리자용 레이아웃 (사이드바 등이 포함된 껍데기)
    lazy: async () => {
      const { default: AdminLayout } = await import('@/layouts/AdminLayout');
      return { Component: AdminLayout };
    },
    children: [
      {
        index: true, // /admin 접속 시 바로 보여줄 페이지
        lazy: async () => {
          const { default: AdminDashboard } = await import('@/pages/admin/Dashboard');
          return { Component: AdminDashboard };
        },
      },
      {
        path: 'users', // /admin/users
        lazy: async () => {
          const { default: UserManagement } = await import('@/pages/admin/UserManagement');
          return { Component: UserManagement };
        },
      },
      {
        path: 'settings', // /admin/settings
        lazy: async () => {
          const { default: AdminSettings } = await import('@/pages/admin/Settings');
          return { Component: AdminSettings };
        },
      },
    ],
  },
  {
    path: '/dashboard',
    lazy: async () => {
      const { default: Dashboard } = await import('@/pages/dashboard/Dashboard.jsx');
      return { Component: Dashboard };
    },
  },
  {
    path: '/mypage',
    lazy: async () => {
      const { default: MyPage } = await import('@/pages/user/MyPage');
      return { Component: MyPage };
    },
  },
  {
    path: '/404',
    lazy: async () => {
      const { default: NotFound } = await import('@/pages/error/NotFound');
      return { Component: NotFound };
    },
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
], {
  // v7 미래 플러그 (경고 제거 및 최적화)
  future: {
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
});

function AppRouter() {
  /**
   * RouterProvider 사용
   */
  return <RouterProvider router={router} fallbackElement={<PageLoader />} />;
}

export default AppRouter;