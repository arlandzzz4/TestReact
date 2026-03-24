// src/api/fcm/fcmConfig.js 예시
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { properties } from "../../constants/properties.js";

// 우리 프로젝트의 Firebase 설정값 (properties.js에 정의되어 있어야 함)
const firebaseConfig = {
  apiKey: properties.firebaseApiKey,
  authDomain: properties.firebaseAuthDomain,
  projectId: properties.firebaseProjectId,
  storageBucket: properties.firebaseStorageBucket,
  messagingSenderId: properties.firebaseMessagingSenderId,
  appId: properties.firebaseAppId,
  measurementId: properties.firebaseMeasurementId
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);