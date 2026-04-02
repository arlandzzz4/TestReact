import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser, logoutUser, registUser } from '../../api/authApi';
import { useAuthStore } from '../../store/useAuthStore';
import { handleLoginRedirect } from '@/utils/navigation';

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => { // response.data가 넘어오므로 이름을 data로 변경
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
          //handleLoginRedirect(navigate, location);
        }else{
          if(message)
            alert(message);
          navigate('/Agreement', { replace: true });
        }
      } catch (err) {
        console.error("onSuccess 내부 실행 에러:", err);
        alert("로그인 처리 중 오류가 발생했습니다.");
      }
    },
    onError: (error) => {
      const responseData = error.response?.data;
      const serverMessage = responseData?.message; // 백엔드 ErrorResponse의 필드명 확인
      const status = error.response?.status;
      console.error('로그인 에러:', error);
      if (status === 401) {
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
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: logoutUser,
    // 성공하든 실패하든 클라이언트 상태는 무조건 지우고 로그인 페이지로 보냅니다.
    onSettled: () => {
      logout(); 
      navigate('/', { replace: true });//handleLoginRedirect(navigate, location);
    },
  });
};

export const useRegistMutation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  return useMutation({
    mutationFn: registUser,
    onSuccess: (data, variables) => {
      alert('회원가입이 완료되었습니다!');
      
      if (variables.token && data) {
        login(data.user, data.token);
        handleLoginRedirect(navigate, location);
      } else {
        navigate('/login', { replace: true });
      }
    },
    onError: (error) => {
      const errorMessage = error.message || '회원가입에 실패했습니다.';
      alert(errorMessage);
    }
  });
};