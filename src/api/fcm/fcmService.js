import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../../config/firebase";
import { instance } from '../axios';
import { properties } from '../../constants/properties.js';

export const requestForToken = async (accessToken) => {
  // 브라우저 미지원 케이스 방어
  if (!('Notification' in window)) {
    console.log("이 브라우저는 알림을 지원하지 않습니다.");
    return null;
  }

  try {
    const currentPermission = Notification.permission;

    if (currentPermission === 'denied') {
      alert("알림 권한이 차단되어 있습니다. 브라우저 주소창 왼쪽의 '설정' 아이콘을 눌러 알림을 허용해 주세요.");
      return null;
    }
console.log("vapidKey1~~~~~~~~~~~~~~~~~~~~~~~~~~", properties );
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;
    
    const fcmDeviceToken = await getToken(messaging, { 
      vapidKey: properties.vapidKey
    });
    console.log("fcmDeviceToken~~~~~~~~~~~~~~~~~~~~~~~~~~", fcmDeviceToken );
    if (fcmDeviceToken) {
      try {
        await instance.patch("/api/user/me/fcmToken", { fcmToken: fcmDeviceToken }, { 
          headers: { Authorization: `Bearer ${accessToken}` } 
        });
        console.log("서버에 토큰 등록 완료");
      } catch (err) {
        console.error("서비 연동 실패. 하지만 토큰은 확보됨:", fcmDeviceToken);
      }
      return fcmDeviceToken;
    }
  } catch (err) {
    console.error("FCM 프로세스 중 에러:", err);
    throw err;
  }
};

export const setupOnMessageListener = (callback) => {
  return onMessage(messaging, (payload) => {
    console.log("포그라운드 메시지 수신:", payload);
    
    // 포그라운드 알림 표시
    const link = payload.data?.link_url;
    const notification = new Notification(payload.notification.title, {
      body: payload.notification.body,
    });
    
    // 클릭 시 해당 게시글로 이동
    notification.onclick = () => {
      if (link) window.location.href = link;
    };
    
    callback(payload);
  });
};