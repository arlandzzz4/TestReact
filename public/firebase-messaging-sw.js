// 1. 필요한 라이브러리 임포트 (서비스 워커 전용 방식)
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// 2. Firebase 초기화 (src의 설정을 쓸 수 없으므로 여기에 직접 입력)
// 변경 이유: 서비스 워커는 public 폴더 내에서 독립적으로 실행되므로 외부 src 파일을 참조할 수 없습니다.
const firebaseConfig = {
  apiKey: "AIzaSyCd0hcK5K3kHof71Slk7yR8nwswMcVC6F0",
  authDomain: "iob-project-87e69.firebaseapp.com",
  projectId: "iob-project-87e69",
  storageBucket: "iob-project-87e69.firebasestorage.app",
  messagingSenderId: "G-0T6Y6CBPF2",
  appId: "1:203394260730:web:f4ed4d7feafdbe533db343"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// 3. 백그라운드 메시지 수신
messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] 백그라운드 메시지 수신:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png', 
    badge: '/badge.png',
    data: {
      link_url: payload.data.link_url // 서버에서 data 항목에 보낸 URL
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 4. 알림 클릭 이벤트 처리
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const targetUrl = event.notification.data.link_url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (let i = 0; i < windowClients.length; i++) {
        let client = windowClients[i];
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});