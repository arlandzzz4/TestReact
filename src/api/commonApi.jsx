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

export const deleteComment = async (data) => {
  try {
    const response = await instance.delete(`/api/post/comment/delete`, { data });
    return response.data;
  } catch (error) {
    console.error("댓글 삭제 중 오류 발생:", error);
    throw error;
  }
};