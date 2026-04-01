import { instance } from './axios.jsx';


export const searchEmail = async (email) => {
  try {
    const response = await instance.post(`/api/user/search/${email}`);
    return response.data;
  } catch (error) {
    console.error("이메일 검색 중 오류 발생:", error);
    throw error;
  }
};
