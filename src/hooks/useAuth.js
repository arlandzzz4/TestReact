import { useAuthStore } from '../store/useAuthStore';


export const useAuth = () => {
  // Zustand 스토어 구독
  const { user, isLoggedIn, token, login, logout } = useAuthStore();

  // 1. 관리자 여부 판별 로직
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN';

  // 2. 인증 여부 확인
  const isAuthenticated = isLoggedIn && !!token;

  // 3. Zustand Persist 동기화 로딩 확인
  const isAuthLoading = useAuthStore.persist?.hasHydrated 
    ? !useAuthStore.persist.hasHydrated() 
    : false;

  return {
    user,
    isAdmin,
    isAuthenticated,
    isAuthLoading,
    login,
    logout,
  };
};