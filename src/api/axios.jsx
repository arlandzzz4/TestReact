import axios from 'axios';
import { properties } from '../constants/properties.js';
import { useAuthStore } from '../store/useAuthStore.jsx';

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

instance.interceptors.request.use(
  (config) => {
    if (!config.headers.Authorization) {
      const token = useAuthStore.getState().accessToken || useAuthStore.getState().token; 
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    //config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const originalRequest = config;

    if (!response) return Promise.reject(error);

    if (originalRequest.url.includes(LOGIN_ENDPOINT)) {
      return Promise.reject(error);
    }

    const { logout, login, user } = useAuthStore.getState();

    const isTokenExpired = response.status === 401 && (response.data?.code === 'EXPIRED_TOKEN' || !response.data?.code);

    if (isTokenExpired && !originalRequest._retry) {
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
        const { data } = await axios.post(`${API_BASE_URL}${REFRESH_ENDPOINT}`, {}, { withCredentials: true });
        
        const newToken = data.accessToken || data.token || data.data?.accessToken;
        if (!newToken) throw new Error('새 토큰을 찾을 수 없습니다.');

        login(user, newToken); 
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
        //logout(); // Zustand 스토어 초기화 (persist 스토리지도 알아서 비워짐)
        //window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (response.status !== 401) {
      const errorMsg = response.data?.message || '문제가 발생했습니다.';
      console.error(`[API Error] ${response.status}: ${errorMsg}`);
    }

    return Promise.reject(error);
  }
);