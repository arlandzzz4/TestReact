import { instance } from './axios.jsx';

export const searchCommentTotalCount = async (data) => {
  try {
    const response = await instance.get(`/api/post/comment/search/totalcnt`, {params : data});
    return response.data;
  } catch (error) {
    console.error("총 댓글 조회 중 오류 발생:", error);
    throw error;
  }
};

export const searchCommentTodayCount = async () => {
  try {
    const response = await instance.get(`/api/post/comment/search/todaycnt`);
    return response.data;
  } catch (error) {
    console.error("오늘 댓글 조회 중 오류 발생:", error);
    throw error;
  }
};

export const searchCommentList = async (data) => {
  try {
    const response = await instance.get(`/api/post/comment/search/comment`, {params : data});
    return response.data;
  } catch (error) {
    console.error("게시글 조회 중 오류 발생:", error);
    throw error;
  }
};
