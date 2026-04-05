import { instance } from './axios.jsx';

export const searchPostTotalCount = async () => {
  try {
    const response = await instance.get(`/api/post/search/totalcnt`);
    return response.data;
  } catch (error) {
    console.error("총 게시글 조회 중 오류 발생:", error);
    throw error;
  }
};

export const searchPostTodayCount = async () => {
  try {
    const response = await instance.get(`/api/post/search/todaycnt`);
    return response.data;
  } catch (error) {
    console.error("오늘 게시글 조회 중 오류 발생:", error);
    throw error;
  }
};

export const searchCommentTotalCount = async () => {
  try {
    const response = await instance.get(`/api/post/comment/search/totalcnt`);
    return response.data;
  } catch (error) {
    console.error("총 게시글 조회 중 오류 발생:", error);
    throw error;
  }
};

export const searchCommentTodayCount = async () => {
  try {
    const response = await instance.get(`/api/post/comment/search/todaycnt`);
    return response.data;
  } catch (error) {
    console.error("오늘 게시글 조회 중 오류 발생:", error);
    throw error;
  }
};

export const searchPostList = async (data) => {
  try {
    const response = await instance.get(`/api/post/search/post`, {params : data});
    return response.data;
  } catch (error) {
    console.error("게시글 조회 중 오류 발생:", error);
    throw error;
  }
};

export const deletePost = async (data) => {
  try {
    const response = await instance.delete(`/api/post/delete`, { data });
    return response.data;
  } catch (error) {
    console.error("게시글 삭제 중 오류 발생:", error);
    throw error;
  }
};
