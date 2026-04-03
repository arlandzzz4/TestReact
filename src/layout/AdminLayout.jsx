import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppAdminSidebar, AppFooter, AppAdminHeader, AppContent } from '../components/adminIndex'

const AdminLayout = () => (
  <div>
      {/* 1. 사이드바 (고정 위치) */}
      <AppAdminSidebar />
      
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        {/* 2. 헤더 (상단 네비게이션) */}
        <AppAdminHeader />
        
        {/* 3. 실제 컨텐츠 영역 */}
        <div className="body flex-grow-1 px-3">
          {/* [핵심]: AppContent 내부에서 Outlet이 호출되어 페이지가 바뀝니다. */}
          <AppContent />
        </div>
        
        {/* 4. 푸터 */}
        <AppFooter />
      </div>
    </div>
);

export default AdminLayout;