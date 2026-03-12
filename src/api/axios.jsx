import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { properties } from '../constants/properties.js';

// 중앙 집중식 상수로 관리하여 경로 수정이 용이하게 변경
const API_BASE_URL = properties.getBaseUrl();
const REFRESH_ENDPOINT = '/api/auth/reissue';
const LOGIN_ENDPOINT = '/api/auth/login';

export const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// [요청 인터셉터]
instance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// [응답 인터셉터]
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const originalRequest = config;

    // [로그인 페이지 401 에러]
    // 로그인 시도 중에 발생한 401은 토큰 만료가 아니라 '아이디/비번 틀림'이므로 갱신 로직을 타지 않습니다.
    if (originalRequest.url.includes(LOGIN_ENDPOINT)) {
      return Promise.reject(error);
    }

    const { logout, login, user } = useAuthStore.getState();

    if (response) {
      // 401 에러 + 만료 코드 + 재시도 안 함
      if (response.status === 401 && response.data?.code === 'EXPIRED_TOKEN' && !originalRequest._retry) {
        
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return instance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // 토큰 갱신 시 별도의 axios 인스턴스 사용
          const { data } = await axios.post(`${API_BASE_URL}${REFRESH_ENDPOINT}`, {}, { withCredentials: true });
          
          // 다양한 백엔드 응답 규격에 대응 (Fallback 적용)
          const newToken = data.accessToken || data.token || data.data?.accessToken;

          if (!newToken) throw new Error('새 토큰을 찾을 수 없습니다.');

          login({ ...user, accessToken: newToken });
          processQueue(null, newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          alert('세션이 만료되었습니다. 안전하게 로그아웃합니다.');
          logout();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // 401 외의 에러 처리 (로그 삭제 및 공통 경고)
      if (response.status !== 401) {
        const errorMsg = response.data?.message || '문제가 발생했습니다.';
        console.error(`[API Error] ${response.status}: ${errorMsg}`);
      }
    }

    return Promise.reject(error);
  }
);