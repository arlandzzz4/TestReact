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
        Authorization: `Bearer ${token}` 
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

export const logoutUser = async (userData) => {
  try {
    await instance.post('/api/auth/logout', userData);
  } catch (error) {
    console.error("서버 로그아웃 처리 중 오류 발생:", error);
  }
};
