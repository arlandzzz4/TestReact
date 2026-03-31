export const properties = {
  salt: "salt",
  getBaseUrl: () => {
    const url = import.meta.env.VITE_API_BASE_URL;
    return url && url !== 'api' ? url : '/';
  },
  isDev: import.meta.env.DEV,
  // 개발 환경에서만 로그를 남기고 싶을 때 사용하는 유틸
  log: (...args) => {
    if (import.meta.env.DEV) {
      console.log('🛠️ [DEV_LOG]:', ...args);
    }
  },
  gaMeasurementId: import.meta.env.VITE_GA_MEASUREMENT_ID,
  vapidKey: import.meta.env.VITE_VAPID_KEY,
  firebaseApiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_API_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};