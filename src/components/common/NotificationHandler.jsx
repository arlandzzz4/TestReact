// NotificationHandler.jsx 수정본
const NotificationHandler = ({ children }) => {
  const { user, accessToken } = useAuthStore();

  useEffect(() => {
    // 유저가 있고 토큰이 있을 때만 작동
    if (user && accessToken) {
      // 1. 토큰 요청 및 서버 등록
      requestForToken(accessToken).catch(console.error);

      // 2. 포그라운드 리스너 (딱 한 번만 등록됨)
      const unsubscribe = setupOnMessageListener((payload) => {
        console.log('포그라운드 알림 수신:', payload);

        // 데이터에 ID가 있다면 로컬 스토리지 등으로 체크 가능
        // if (checkDuplicate(payload.data.msgId)) return;

        // 시스템 알림 띄우기
        if (Notification.permission === 'granted') {
          new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: '/logo192.png',
          });
        }
      });

      return () => {
        console.log("리스너 해제");
        unsubscribe(); 
      };
    }
  }, [user, accessToken]);

  return children;
};