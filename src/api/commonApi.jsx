import { instance } from './axios.jsx';

 
export const searchCodeGroup = async (codeGroup) => {
  try {
    const response = await instance.get(`/api/common/groupcodeList/${codeGroup}`);
    return response.data;
  } catch (error) {
    console.error("코드 그룹 검색 중 오류 발생:", error);
    throw error;
  }
};