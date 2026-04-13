import { instance } from './axios.jsx';

 
export const searchEmail = async (email) => {
  try {
    const response = await instance.get(`/api/user/search/${email}`);
    return response.data;
  } catch (error) {
    console.error("이메일 검색 중 오류 발생:", error);
    throw error;
  }
};

export const searchUserTotalCount = async (data) => {
  try {
    const response = await instance.get(`/api/user/search/totalcnt`, {params : data});
    return response.data;
  } catch (error) {
    console.error("총 유저 조회 중 오류 발생:", error);
    throw error;
  }
};

export const searchUserTodayCount = async () => {
  try {
    const response = await instance.get(`/api/user/search/todaycnt`);
    return response.data;
  } catch (error) {
    console.error("오늘 가입 유저 조회 중 오류 발생:", error);
    throw error;
  }
};

export const searchUserList = async (data) => {
  try {
    const response = await instance.get(`/api/user/search/user`, {params : data});
    return response.data;
  } catch (error) {
    console.error("유저 조회 중 오류 발생:", error);
    throw error;
  }
}

export const updateUserStatusCode = async (data) => {
  try {
    await instance.patch(`/api/user/updateUserStatusCode`, data);
  } catch (error) {
    console.error("유저 상태 코드 업데이트 중 오류 발생:", error);
    throw error;
  }
}

export const updateNickname = async (data) => {
  try {
    const response = await instance.patch('/api/user/me/nickname', data);
    return response.data;
  } catch (error) {
    console.error("닉네임 변경 실패:", error);
    throw error;
  }
};

export const updatePassword = async (data) => {
  try {
    const response = await instance.patch('/api/user/me/password', {
      email: data.email,        // < 이메일 추가
      newPassword: data.newPassword
    });
    return response.data;
  } catch (error) {
    console.error("백엔드 비밀번호 변경 실패:", error);
    throw error;
  }
};

export const unsubscribe = async (data) => {
  try {
    await instance.post (`/api/user/unsubscribe`, data);
  } catch (error) {
    console.error("유저 탈퇴 중 오류 발생:", error);
    throw error;
  }
}