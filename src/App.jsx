import React, { Suspense, lazy, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { 
  QueryClient, 
  QueryClientProvider, 
  useQuery, 
  useQueryErrorResetBoundary 
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useAuthStore } from '@/store/useAuthStore';
import { instance } from '@/api/axios';
import { properties } from './constants/properties.js';
import ErrorFallback from '@/components/error/ErrorFallback';
import ReactGA from "react-ga4";

const AppRouter = lazy(() => import('./routes/AppRouter'));

//Google Analytics
const GA_MEASUREMENT_ID = properties.gaMeasurementId

if (GA_MEASUREMENT_ID) {
  ReactGA.initialize(GA_MEASUREMENT_ID);
} else {
  console.warn("⚠️ GA_MEASUREMENT_ID가 설정되지 않았습니다. 분석을 건너뜁니다.");
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function AuthWrapper({ children }) {
  console.log("!!! AuthWrapper Component Mounted !!!"); // 👈 이게 찍히는지 확인
  
  const { isLoggedIn, user, login, logout, token } = useAuthStore();
  console.log("Current Auth State:", { isLoggedIn, hasUser: !!user });

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      console.log("Fetching /me with token:", token);
      
      const { data } = await instance.get('/api/auth/me');
      return data;
    },
    enabled: !!isLoggedIn && !user,
    retry: false,
  });

  useEffect(() => {
    if (isSuccess && data) {
      login(data, token);
    }
    if (isError) {
      console.error("인증 정보 로드 실패");
      logout();
    }
  }, [isSuccess, isError, data, login, logout]);

  // 로딩 상태일 때 화면이 튀는 것을 방지
  if (isLoading) return <div className="text-center mt-10">사용자 확인 중...</div>;

  return children;
}

function App() {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={reset} // '다시 시도' 클릭 시 실행될 로직
        onError={(error, info) => {
          // 개발 모드에서 에러 상세 로그 출력
          if (properties.isDev) {
            console.error('Captured by Boundary:', error, info);
          }
        }}
      >
        <AuthWrapper>
          <Suspense 
            fallback={
              <div className="flex items-center justify-center min-h-screen text-lg">
                페이지를 구성 중입니다...
              </div>
            }
          >
            <AppRouter />
          </Suspense>
        </AuthWrapper>
      </ErrorBoundary>

      {properties.isDev && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      )}
    </QueryClientProvider>
  );
}

export default App;