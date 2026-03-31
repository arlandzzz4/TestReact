import { instance } from './axios';
import { requestForToken } from './fcm/fcmService';

export const loginUser = async (credentials) => {
  const response = await instance.post('/api/auth/login', credentials);
  
  //if (!response.data || !response.data.user) {
  //  throw new Error('USER_INFO_NOT_FOUND');
  //}
  
  if (response.status === 200) {
    requestForToken().catch(err => {
      console.error("FCM 초기화 실패 (로그인은 유지):", err);
    });
  }
  
  return response.data;
};

export const registUser = async (userData) => {
  try {
    const response = await instance.post('/api/auth/regist', userData);
    
    return response.data; 
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data; 
    }
    throw new Error("회원가입 중 알 수 없는 오류가 발생했습니다.");
  }
};

export const logoutUser = async () => {
  try {
    await instance.post('/api/auth/logout');
  } catch (error) {
    console.error("서버 로그아웃 처리 중 오류 발생:", error);
  }
};
