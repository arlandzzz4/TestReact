import { instance } from './axios';
import { requestForToken } from './fcm/fcmService.js';

/**
 * 로그인 요청 함수
 * @param {Object} credentials - 로그인 정보
 */
export const loginUser = async (credentials) => {
  const response = await instance.post('/api/auth/login', credentials);
  
  // 서버가 200 OK를 주더라도, 내부적으로 유저 정보가 비어있는 예외 상황 처리
  if (!response.data || !response.data.user) {
    throw new Error('USER_INFO_NOT_FOUND');
  }
  
  if (response.status === 200) {
    // 권한 요청 팝업이 로그인 완료 직후 바로 뜨도록 유도
    requestForToken().catch(err => {
      console.error("FCM 초기화 실패 (로그인은 유지):", err);
    });
  }
  
  return response.data;
};

/**
 * 회원가입 요청 함수
 * @param {Object} userData - 가입 정보 (email, password, nickname 등)
 */
export const registUser = async (userData) => {
  try {
    const response = await instance.post('/api/auth/regist', userData);
    
    // 만약 가입 성공 후 서버가 토큰을 준다면 (자동 로그인 처리)
    if (response.data && response.data.accessToken) {
      // 쿠키가 막힌 사용자를 위해 로컬 스토리지에도 저장
      localStorage.setItem("accessToken", response.data.accessToken);
    }
    
    return response.data; // 성공 데이터 반환 (id, email 등 포함)
  } catch (error) {
    // [중요] 409 Conflict(이메일 중복) 등 비즈니스 예외를 상위 컴포넌트로 전달
    if (error.response && error.response.data) {
      // 서버의 ErrorResponse 형식을 그대로 던짐
      throw error.response.data; 
    }
    throw new Error("회원가입 중 알 수 없는 오류가 발생했습니다.");
  }
};

/**
 * 사용자 로그 아웃 함수
 */
export const logoutUser = async () => {
  try {
    // 1. 서버에 로그아웃 알림 (서버 DB에서 Refresh Token 삭제 등)
    await instance.post('/api/auth/logout');
  } catch (error) {
    console.error("서버 로그아웃 처리 중 오류 발생:", error);
  } finally {
    // 2. 쿠키가 차단된 환경을 대비해 로컬 스토리지를 강제로 비움
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user_info"); // 저장된 유저 정보가 있다면 삭제
    
    // 3. 페이지 새로고침 또는 로그인 페이지로 이동 (상태값 초기화 목적)
    window.location.href = '/login';
  }
};

/**
 * 전역 Axios 헤더에 토큰을 설정하거나 제거하는 유틸리티
 */
export const setAuthHeader = (token) => {
  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common['Authorization'];
  }
};