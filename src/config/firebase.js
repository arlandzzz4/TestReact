import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getMessaging } from "firebase/messaging";
import { properties } from "../constants/properties.js";

const firebaseConfig = {
  apiKey: properties.firebaseApiKey,
  authDomain: properties.authDomain,
  projectId: properties.projectId,
  storageBucket: properties.storageBucket,
  messagingSenderId: properties.messagingSenderId,
  appId: properties.appId,
  measurementId: properties.measurementId
};

// 1. Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// 2. 인증 객체
export const auth = getAuth(app);

// 3. 구글 로그인 제공자
export const googleProvider = new GoogleAuthProvider();

// 4. 알림 객체
export const messaging = getMessaging(app);

export default app;