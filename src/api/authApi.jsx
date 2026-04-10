import { instance } from './axios';

export const loginUser = async ({ userData, token }) => {
  const response = await instance.post('/api/auth/login', userData, {
    headers: {
      Authorization: `Bearer ${token}` // Firebase 토큰은 헤더로!
    }
  });
  //if (!response.data || !response.data.user) {
  //  throw new Error('USER_INFO_NOT_FOUND');
  //}
  
  // if (response.status === 200) {
  //   requestForToken().catch(err => {
  //     console.error("FCM 초기화 실패 (로그인은 유지):", err);
  //   });
  // }
  
  return response.data;
};

export const registUser = async ({ userData, token }) => {
  try {
    const response = await instance.post('/api/auth/regist', userData, {
      headers: {
        Authorization: `Bearer ${token}` // [핵심] 백엔드로 토큰 전달
      }
    });
    return response.data; 
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data; 
    }
    throw new Error("회원가입 중 알 수 없는 오류가 발생했습니다.");
  }
};

export const logoutUser = async (logoutData) => {
  try {
    console.log("실제 서버로 전송되는 데이터:", logoutData);
    await instance.post('/api/auth/logout', logoutData);
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn("이미 세션이 만료되었습니다. 클라이언트 로그아웃을 진행합니다.");
      return; 
    }
    // 다른 에러(500 등)는 추적을 위해 유지
    throw error;
  }
};
