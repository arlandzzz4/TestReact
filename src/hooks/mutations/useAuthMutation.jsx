import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser, logoutUser, registUser } from '../../api/authApi';
import { useAuthStore } from '../../store/useAuthStore';
import { handleLoginRedirect } from '@/utils/navigation';


const createAuthHandler = (login, navigate, location) => async (data) => {
  try {
    const { accessToken, user, success, message } = data;

    if (accessToken) {
      // 1. 전역 상태 저장
      login(user, accessToken);

      // 2. FCM 등록 (지연 로딩)
      import('@/api/fcm/fcmService').then(({ requestForToken }) => {
        requestForToken(accessToken).catch(err => console.error("FCM 지연 등록 실패:", err));
      });
    }

    if (success) {
      if (!accessToken) throw new Error("토큰이 응답에 포함되어 있지 않습니다.");
      // 3. 리다이렉트 처리
      handleLoginRedirect(navigate, location);
    } else if (message) {
      alert(message);
    }
  } catch (err) {
    console.error("인증 처리 중 에러:", err);
    alert("처리 중 오류가 발생했습니다.");
  }
};


export const useLoginMutation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const handleAuthSuccess = createAuthHandler(login, navigate, location);

  return useMutation({
    mutationFn: loginUser,
    onSuccess: handleAuthSuccess,
    onError: (error) => {
      const responseData = error.response?.data;
      const serverMessage = responseData?.message; // 백엔드 ErrorResponse의 필드명 확인
      const serverCode = responseData?.code;
      const status = error.response?.status;
      console.error('로그인 에러:', error);
      if (status === 403 || serverCode === 'AUTH_001') {
        alert(serverMessage || '활동이 정지된 계정입니다. 관리자에게 문의하세요.');
      } else if (status === 401) {
        alert('아이디 또는 비밀번호가 틀렸습니다.');
      } else if (status === 400 && serverMessage) {
        if (serverMessage.includes("회원가입")) {
          navigate('/regist', { replace: true });
        }
        alert(serverMessage);
      } 
      else {
        alert('로그인 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
  });
};

export const useLogoutMutation = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: (data)=>logoutUser(data),
    // 성공하든 실패하든 클라이언트 상태는 무조건 지우고 로그인 페이지로 보냅니다.
    onSettled: () => {
      logout(); 
      navigate('/login', { replace: true }); 
    },
  });
};

export const useRegistMutation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const handleAuthSuccess = createAuthHandler(login, navigate, location);
  return useMutation({
    mutationFn: registUser,
    onSuccess: (data) => {
      alert('회원가입이 완료되었습니다!');
      handleAuthSuccess(data);
    },
    onError: (error) => {
      const errorMessage = error.message || '회원가입에 실패했습니다.';
      alert(errorMessage);
    }
  });
};

const result = (data) => {
  try {
        const { accessToken, user, success, message} = data;
        if (accessToken) {
          login(user, accessToken);

          import('@/api/fcm/fcmService').then(({ requestForToken }) => {
            requestForToken(accessToken).catch(err => console.error("FCM 지연 등록 실패:", err));
          });
        }
        if(success){
          if (!accessToken) {
            throw new Error("토큰이 응답에 포함되어 있지 않습니다.");
          }
          handleLoginRedirect(navigate, location);
        }else{
          if(message)
            alert(message);
        }
      } catch (err) {
        console.error("onSuccess 내부 실행 에러:", err);
        alert("로그인 처리 중 오류가 발생했습니다.");
      }
}