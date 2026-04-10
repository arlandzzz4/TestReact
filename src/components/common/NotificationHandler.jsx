const NotificationHandler = ({ children }) => {
  const { user, accessToken } = useAuthStore();

  useEffect(() => {
    if (user && accessToken) {
      requestForToken(accessToken).catch(console.error);

      const unsubscribe = setupOnMessageListener((payload) => {
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user, accessToken]);

  return children;
};