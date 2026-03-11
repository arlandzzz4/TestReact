import { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useAuthStore } from '@/store/useAuthStore';
import { instance } from '@/api/instance';
import { properties } from './constants/properties.js';
import AppRouter from './AppRouter';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      // 기본적으로 캐시 데이터가 있으면 stale 상태에서도 
      // 로딩 바를 띄우지 않도록 설정 최적화가 가능합니다.
    },
  },
});

function AuthWrapper({ children }) {
  const { isLoggedIn, user, login, logout } = useAuthStore();

  // AppRouter를 lazy로 불러와 초기 번들 크기를 줄입니다.
  // 사용자가 앱에 접속했을 때 라우팅 설정 파일 전체를 한꺼번에 받지 않아도 됩니다.
  const AppRouter = lazy(() => import('./AppRouter'));

  const queryClient = new QueryClient();

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const { data } = await instance.get('/api/auth/me');
      return data;
    },
    // 로그인은 되어있는데 유저 정보가 없을 때만 실행
    enabled: isLoggedIn && !user,
  });

  useEffect(() => {
    if (isSuccess && data) {
      login(data); // 성공 시 Zustand 스토어 채우기
    }
    if (isError) {
      logout();    // 에러 시 로그아웃 처리
    }
  }, [isSuccess, isError, data, login, logout]);

  // 인증 복구 중(API 호출 중)일 때의 가드 로직
  if (isLoggedIn && !user && isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        인증 정보를 확인 중입니다...
      </div>
    );
  }

  return children;
}

function App() {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={reset}
      >
        <AuthWrapper>
          {/* lazy 컴포넌트(AppRouter)가 로드되는 동안 보여줄 UI를 지정합니다. */}
          {/* 보통 스피너나 간단한 로고 화면을 배치합니다. */}
          <Suspense fallback={<div className="loading-screen">페이지를 구성 중입니다...</div>}>
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