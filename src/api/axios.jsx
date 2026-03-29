import axios from 'axios';
import { properties } from '../constants/properties.js';
import { useAuthStore } from '../store/useAuthStore.jsx';

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
instance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken || useAuthStore.getState().token; 
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// [응답 인터셉터]
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const originalRequest = config;

    if (!response) return Promise.reject(error);

    // 로그인 시도 중 발생한 401은 무시
    if (originalRequest.url.includes(LOGIN_ENDPOINT)) {
      return Promise.reject(error);
    }

    const { logout, login, user } = useAuthStore.getState();

    // 401 에러 + 만료 코드(EXPIRED_TOKEN) 대응
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
        // 토큰 갱신 시에는 무한 루프 방지를 위해 기본 axios 사용
        const { data } = await axios.post(`${API_BASE_URL}${REFRESH_ENDPOINT}`, {}, { withCredentials: true });
        
        const newToken = data.accessToken || data.token || data.data?.accessToken;

        if (!newToken) throw new Error('새 토큰을 찾을 수 없습니다.');

        // 스토어 업데이트
        login(user, newToken); 
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
        logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 401 외의 에러 공통 처리
    if (response.status !== 401) {
      const errorMsg = response.data?.message || '문제가 발생했습니다.';
      console.error(`[API Error] ${response.status}: ${errorMsg}`);
    }

    return Promise.reject(error);
  }
);