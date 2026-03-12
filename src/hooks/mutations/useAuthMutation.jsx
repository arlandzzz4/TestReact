import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginUser, logoutUser, registUser, setAuthHeader } from '../../api/authApi';
import { useAuthStore } from '../../store/useAuthStore';

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login); // Store 액션 가져오기

  return useMutation({
    mutationFn: loginUser,
    
    // 로그인 성공 시 메인 대시보드나 홈 화면으로 이동합니다.
    onSuccess: (response) => {
      try {
        console.log("서버 응답 데이터:", response); // 1. 데이터 구조 확인용 로그
        
        // 백엔드 응답이 response.data에 들어있는지, 아니면 response 자체인지 확인
        const target = response.data || response; 
        const { accessToken, user } = target;

        if (!accessToken) {
          throw new Error("토큰이 응답에 포함되어 있지 않습니다.");
        }

        // 2. Zustand 저장 (Zustand 내부 로직 에러 방지)
        login(user || null, accessToken);
        
        // 3. 이동
        navigate('/dashboard', { replace: true });
        
      } catch (err) {
        // 여기서 에러가 나면 아래 onError가 아니라 이 catch 블록이 잡습니다.
        console.error("onSuccess 내부 실행 에러:", err);
        alert("로그인 처리 중 오류가 발생했습니다.");
      }
    },

    // 에러 종류에 따라 다른 화면으로 보내거나 알림을 띄웁니다.
    onError: (error) => {
      console.error('로그인 에러:', error);

      const status = error.response?.status;
      if (error.response?.status === 401) {
        alert('아이디 또는 비밀번호가 틀렸습니다.');
      } else {
        alert('서버 에러가 발생했습니다. 잠시 후 다시 시도해주세요.', error.response?.status);
      }
    }
  });
};

export const useLogoutMutation = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: logoutUser,
    // 성공/실패 여부와 상관없이(onSettled) 클라이언트 정보는 삭제
    onSettled: () => {
      logout(); // Zustand 상태 초기화 (localStorage 포함)
      navigate('/login', { replace: true }); // 로그인 페이지로 이동
    },
  });
};

export const useRegistMutation = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login); // 자동 로그인을 원할 경우

  return useMutation({
    mutationFn: registUser,
    
    // 회원가입 성공 시
    onSuccess: (data) => {
      alert('회원가입이 완료되었습니다!');
      
      // 만약 백엔드에서 가입 즉시 토큰을 준다면 (자동 로그인)
      if (data.accessToken && data.user) {
        login(data.user, data.accessToken);
        navigate('/', { replace: true }); // 메인으로 이동
      } else {
        // 토큰을 안 준다면 로그인 페이지로 이동
        navigate('/login', { replace: true });
      }
    },

    // 회원가입 실패 시 (이메일 중복 등)
    onError: (error) => {
      // 서버에서 보낸 에러 메시지 확인 (GlobalExceptionHandler에서 보낸 409 등)
      const errorMessage = error.response?.data?.message || '회원가입에 실패했습니다.';
      alert(errorMessage);
      // 에러 시에는 navigate를 하지 않고 사용자가 내용을 수정하게 둠
    }
  });
};