import React, { useEffect, useRef } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import PageLoader from './PageLoader';

const AuthGuard = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const isRedirecting = useRef(false); // StrictMode에서 이중 실행 방지용 Ref

  useEffect(() => {
    // 이미 리다이렉트 중이면 중복 실행 방지
    if (isRedirecting.current) return;

    if (!isAuthLoading) {
      if (!isAuthenticated) {
        isRedirecting.current = true; // 리다이렉트 플래그 설정

        const isLoggingOut = sessionStorage.getItem('isLoggingOut');
        if (isLoggingOut){
          sessionStorage.removeItem('isLoggingOut');
          navigate('/', { replace: true });
        }else{
          alert('로그인이 필요한 서비스입니다.');
          navigate('/login', { replace: true });
        }
      } else if (adminOnly && !isAdmin) {
        isRedirecting.current = true; // 리다이렉트 플래그 설정
        alert('관리자 권한이 필요합니다.');
        navigate('/', { replace: true });
      }
    }
  }, [isAuthLoading, isAuthenticated, isAdmin, adminOnly, navigate]);

  if (isAuthLoading || !isAuthenticated || (adminOnly && !isAdmin)) return <PageLoader />;

  return children ? children : <Outlet />;
};

export default AuthGuard;