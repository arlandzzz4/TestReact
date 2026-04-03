import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import RootLayout from '../layout/RootLayout';
import DefaultLayout from '../layout/DefaultLayout';
import AdminLayout from '../layout/AdminLayout';
import AuthGuard from '../components/AuthGuard';
import RouterErrorFallback from '../components/error/RouterErrorFallback';
import PostDetail from '../pages/feed/PostDetail';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouterErrorFallback />,
    children: [
      { path: 'login', lazy: () => import('@/pages/auth/Login').then(m => ({ Component: m.default })) },
      { path: 'agreement', lazy: () => import('@/pages/auth/Agreement').then(m => ({ Component: m.default })) },
      { path: 'regist', lazy: () => import('@/pages/auth/Regist').then(m => ({ Component: m.default })) },
      {
        element: <DefaultLayout />,
        children: [
          // 1. 공통/비로그인
          { index: true, element: <Navigate to="/feed" replace /> },
          { 
            path: 'feed', 
            lazy: () => import('@/pages/feed/Feed').then(m => ({ Component: m.default })) 
          },
          //게시글 포스트 상세로 이동하는 라우트 처리
          {
            path: 'post/:id',
            lazy: () => import('@/pages/feed/PostDetail').then(m => ({ Component: m.default })),
          },
          { // [글 수정] 선택 시, 게시글작성 페이지로 이동
            path: 'post/edit/:id',
            lazy: () => import('@/pages/feed/WritePost').then(m => ({ Component: m.default })),
          },

        
        //{ path: 'food-search', lazy: () => import('@/pages/food/FoodSearch').then(m => ({ Component: m.default })) },
        { path: 'calc', lazy: () => import('@/pages/calc/CalcPage').then(m => ({ Component: m.default })) },
        { path: 'map', lazy: () => import('@/pages/map/MapPage').then(m => ({ Component: m.default })) },
        { path: 'foodSearch', lazy: () => import('@/pages/foodSearch/foodSearchPage').then(m => ({ Component: m.default })) },
        
        //테스트 용도로 비인증구역에 넣음. 추후에 인증구역으로 이동 필요
        { path: 'write', lazy: () => import('@/pages/feed/WritePost').then(m => ({ Component: m.default })) },
        
        
        //{ path: 'notifications', lazy: () => import('@/pages/notification/Notification').then(m => ({ Component: m.default })) },
      
        // 2. 일반 인증 구역
        {
          element: <AuthGuard />,
          children: [
            // { path: 'feed', lazy: () => import('@/pages/feed/Feed').then(m => ({ Component: m.default })) },
            { path: 'mypage', lazy: () => import('@/pages/user/MyPage').then(m => ({ Component: m.default })) },
            { path: 'calendar', lazy: () => import('@/pages/calendar/Calendar').then(m => ({ Component: m.default })) },
            { path: 'challenge', lazy: () => import('@/pages/challenge/ChallengePage').then(m => ({ Component: m.default })) },
          ]
        },
      ]
    },

      // 3. 어드민
      {
        path: 'admin',
        element: (
          <AuthGuard adminOnly>
            <AdminLayout />
          </AuthGuard>
        ),
        children: [
          //{ index: true, lazy: () => import('@/pages/admin/Dashboard').then(m => ({ Component: m.default })) },
          //{ path: 'users', lazy: () => import('@/pages/admin/UserManagement').then(m => ({ Component: m.default })) },
          //{ path: 'reports', lazy: () => import('@/pages/admin/ReportManagement').then(m => ({ Component: m.default })) },
          //{ path: 'posts', lazy: () => import('@/pages/admin/PostManagement').then(m => ({ Component: m.default })) },
          //{ path: 'settings', lazy: () => import('@/pages/admin/SiteSettings').then(m => ({ Component: m.default })) },
        ]
      },
      
      // 4. 404 처리
      { 
        path: '*', 
        lazy: () => import('@/pages/error/NotFound').then(m => ({ Component: m.default })) 
      },
    ],
  },
], {
  // v7 브레이킹 체인지 대비 및 성능 최적화 플래그
  future: {
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
});

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;