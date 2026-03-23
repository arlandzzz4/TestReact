import { getToken } from "firebase/messaging";
import { messaging } from "./fcmService"; // 설정 파일
import { instance } from './axios';
import { properties } from '../constants/properties.js';

export const requestForToken = async () => {
  try {
    const token = await getToken(messaging, { 
      vapidKey: properties.vapidKey
    });
    
    if (token) {
      console.log("발급된 토큰:", token);
      instance.post("/api/user/me/fcm-token", { fcmToken: token });
    } else {
      console.log("토큰을 받을 수 없습니다. 권한을 확인하세요.");
    }
  } catch (err) {
    console.error("토큰 획득 중 에러:", err);
  }
};