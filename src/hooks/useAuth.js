import { useAuthStore } from '../store/useAuthStore';
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const checkHydration = () => {
      const hydrated = useAuthStore.persist.hasHydrated();
      setIsHydrated(hydrated);
    };

    checkHydration();
    const unsub = useAuthStore.persist.onHydrate(() => setIsHydrated(false));
    const unsubFinish = useAuthStore.persist.onFinishHydration(() => setIsHydrated(true));

    return () => {
      unsub();
      unsubFinish();
    };
  }, []);

  const isAdmin = user?.roleCode === '02' || user?.roleCode === 'ROLE_ADMIN';
  const isAuthenticated = !!(isLoggedIn && token);
  const isAuthLoading = !isHydrated; // Hydration이 안 끝났으면 로딩 중

  return {
    user,
    isAdmin,
    isAuthenticated,
    isAuthLoading,
    login,
    logout,
  };
};