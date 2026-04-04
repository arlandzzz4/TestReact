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

export const searchUserTotalCount = async () => {
  try {
    const response = await instance.get(`/api/user/search/totalcnt`);
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
    await instance.put(`/api/user/updateUserStatusCode`, data);
  } catch (error) {
    console.error("유저 상태 코드 업데이트 중 오류 발생:", error);
    throw error;
  }
}