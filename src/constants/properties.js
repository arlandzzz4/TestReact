export const properties = {
  salt: "salt",
  getBaseUrl: () => {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  },
  isDev: import.meta.env.DEV,
  // 개발 환경에서만 로그를 남기고 싶을 때 사용하는 유틸
  log: (...args) => {
    if (import.meta.env.DEV) {
      console.log('🛠️ [DEV_LOG]:', ...args);
    }
  }
};