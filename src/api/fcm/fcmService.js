import { getToken } from "firebase/messaging";
import { messaging } from "../../config/firebase";
import { instance } from '../axios';
import { properties } from '../../constants/properties.js';

export const requestForToken = async () => {
  // 브라우저 미지원 케이스 방어
  if (!('Notification' in window)) {
    console.log("이 브라우저는 알림을 지원하지 않습니다.");
    return null;
  }

  try {
    // 권한 요청 (이미 허용되어 있다면 바로 진행됨)
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log("알림 권한이 거부되었습니다.");
      return null;
    }

    const token = await getToken(messaging, { 
      vapidKey: properties.vapidKey
    });
    
    if (token) {
      console.log("발급된 FCM 토큰:", token);
      
      await instance.post("/api/user/me/fcm-token", { fcmToken: token })
        .then(() => console.log("서버에 토큰 등록 완료"))
        .catch(err => console.error("서버 토큰 등록 실패:", err));
        
      return token;
    } else {
      console.log("토큰을 받을 수 없습니다.");
      return null;
    }
  } catch (err) {
    console.error("FCM 프로세스 중 에러:", err);
    throw err;
  }
};