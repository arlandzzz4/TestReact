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

export const searchPostList = async (data) => {
  try {
    const response = await instance.get(`/api/post/search/post`, {params : data});
    return response.data;
  } catch (error) {
    console.error("게시글 조회 중 오류 발생:", error);
    throw error;
  }
};

export const deletePost = async (postId, userEmail) => {
  try {
    const response = await instance.delete(`/api/post/${postId}`, {
      params: { userEmail }
    });
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

export const getPostDetail = async (postId, userEmail) => {
  const response = await instance.get(`/api/post/${postId}`, {
    params: { userEmail }
  });
  return response;
};

export const getCommentList = async (postId, userEmail) => {
  const response = await instance.get(`/api/comment/list/${postId}`, {
    params: { userEmail }
  });
  return response;
};

export const insertComment = async (data) => {
  const response = await instance.post(`/api/comment/insert`, data);
  return response;
};

export const deleteComment = async (commentId) => {
  const response = await instance.patch(`/api/comment/delete/${commentId}`);
  return response;
};

export const togglePostLike = async (postId, userEmail) => {
  const response = await instance.post(`/api/post/${postId}/like`, null, {
    params: { userEmail }
  });
  return response;
};

export const toggleCommentLike = async (commentId, userEmail) => {
  const response = await instance.post(`/api/comment/${commentId}/like`, null, {
    params: { userEmail }
  });
  return response;
};

export const insertReport = async (targetCode, targetId, userEmail, reasonCode) => {
  const response = await instance.post(`/api/post/report`, null, {
    params: { targetCode, targetId, reporterEmail: userEmail, reasonCode }
  });
  return response;
};

export const updatePost = async (postId, postData) => {
  const response = await instance.put(`/api/post/${postId}`, postData);
  return response;
};