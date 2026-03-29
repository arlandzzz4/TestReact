import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import DefaultLayout from '../layout/DefaultLayout';


export const routes = [
  { 
    index: true, 
    name: 'Home', 
    element: <Navigate to="/feed" replace /> 
  },
  { 
    path: '/feed', 
    name: 'feed', 
    lazy: () => import('@/pages/feed/Feed').then(m => ({ Component: m.default })) 
  },
  { 
    path: '/map', 
    name: '지도/루트', 
    lazy: () => import('@/pages/map/MapPage').then(m => ({ Component: m.default })) 
  },
  { 
    path: '/calc', 
    name: '계산기', 
    lazy: () => import('@/pages/calc/CalcPage').then(m => ({ Component: m.default })) 
  },
  { 
    path: '/calendar', 
    name: '캘린더', 
    lazy: () => import('@/pages/calendar/index').then(m => ({ Component: m.default })) 
  }
];

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    // v7 객체 라우터 문법에 맞게 hydrateFallbackElement 속성명 사용
    hydrateFallbackElement: <div className="p-4 text-center">라우터 초기화 중...</div>,
    children: routes
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
  return (
    <RouterProvider 
      router={router} 
      fallbackElement={<div className="p-4 text-center">앱을 불러오는 중...</div>} 
    />
  );
}

export default AppRouter;