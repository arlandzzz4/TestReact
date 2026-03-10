import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginUser, logoutUser, registUser } from '../../api/authApi';
import { useAuthStore } from '../../store/useAuthStore';

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login); // Store 액션 가져오기

  return useMutation({
    mutationFn: loginUser,
    
    // 로그인 성공 시 메인 대시보드나 홈 화면으로 이동합니다.
    onSuccess: (data) => {
      login(data.user, data.accessToken);
      navigate('/', { replace: true }); // replace: true를 주면 뒤로가기 방지
    },

    // 에러 종류에 따라 다른 화면으로 보내거나 알림을 띄웁니다.
    onError: (error) => {
      console.error('로그인 에러:', error);

      if (error.message === 'USER_INFO_NOT_FOUND') {
        alert('로그인은 되었으나 유저 정보를 불러오지 못했습니다.');
        navigate('/error/user-not-found'); // 정보 조회 실패 시 이동
      } else if (error.response?.status === 401) {
        alert('아이디 또는 비밀번호가 틀렸습니다.');
        // 틀렸을 때는 이동하지 않고 현재 페이지에 머물게 할 수도 있고, 
        // 실패 페이지로 보낼 수도 있습니다.
        navigate('/login-fail'); 
      } else {
        navigate('/error/server'); // 서버 장애 등 기타 에러 시 이동
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