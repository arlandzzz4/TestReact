import { instance } from './axios.jsx';

export const searchPostTotalCount = async (data) => {
  try {
    const response = await instance.get(`/api/post/search/totalcnt`, {params : data});
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

export const searchCommentTotalCount = async (data) => {
  try {
    const response = await instance.get(`/api/post/comment/search/totalcnt`, {params : data});
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

export const searchCommentList = async (data) => {
  try {
    const response = await instance.get(`/api/post/comment/search/comment`, {params : data});
    return response.data;
  } catch (error) {
    console.error("게시글 조회 중 오류 발생:", error);
    throw error;
  }
};

export const deletePost = async (data) => {
  try {
    const response = await instance.patch(`/api/post/delete`, data );
    return response.data;
  } catch (error) {
    console.error("게시글 삭제 중 오류 발생:", error);
    throw error;
  }
};

export const createPost = async (postData) => {
  try {
    const response = await instance.post('/api/postwrite/create', postData);
    return response.data; // 반환된 post_id
  } catch (error) {
    console.error("게시글 등록 중 오류 발생:", error);
    throw error;
  }
};

export const uploadPostImages = async (formData) => {
  try {
    const response = await instance.post('/api/photo/uploadList', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error("게시글 이미지 업로드 중 오류 발생:", error);
    throw error;
  }
};
