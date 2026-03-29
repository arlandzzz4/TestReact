import React, { Suspense } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import PageLoader from '../components/PageLoader';

const RootLayout = () => (
  <div className="app-root">
    <ScrollRestoration />
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  </div>
);

export default RootLayout;