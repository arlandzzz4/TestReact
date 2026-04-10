import { instance } from './axios.jsx';

export const searchPostTotalCount = async (data) => {
  try {
    const response = await instance.get(`/api/post/search/totalcnt`, { params: data });
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
    const response = await instance.get(`/api/post/search/post`, { params: data });
    return response.data;
  } catch (error) {
    console.error("게시글 조회 중 오류 발생:", error);
    throw error;
  }
};

export const deletePost = async (data) => {
  try {
    const response = await instance.patch(`/api/post/delete`, data);
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
  try {
    const response = await instance.get(`/api/post/detail`, {
      params: { postId, userEmail }
    });
    return response;
  } catch (error) {
    console.error("게시글 상세 조회 중 오류 발생:", error);
    throw error;
  }
};

export const getCommentList = async (postId, userEmail) => {
  try {
    const response = await instance.get(`/api/comment/list`, {
      params: { postId, userEmail }
    });
    return response;
  } catch (error) {
    console.error("댓글 목록 조회 중 오류 발생:", error);
    throw error;
  }
};

export const insertComment = async (data) => {
  try {
    const response = await instance.post(`/api/comment/insert`, data);
    return response;
  } catch (error) {
    console.error("댓글 등록 중 오류 발생:", error);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await instance.patch(`/api/comment/delete/detail`, null, {
      params: { commentId }
    });
    return response;
  } catch (error) {
    console.error("댓글 삭제 중 오류 발생:", error);
    throw error;
  }
};

export const togglePostLike = async (postId, userEmail) => {
  try {
    const response = await instance.post(`/api/post/like`, null, {
      params: { postId, userEmail }
    });
    return response;
  } catch (error) {
    console.error("게시글 좋아요 중 오류 발생:", error);
    throw error;
  }
};


export const toggleCommentLike = async (commentId, userEmail) => {
  try {
    const response = await instance.post(`/api/comment/like`, null, {
      params: { commentId, userEmail }
    });
    return response;
  } catch (error) {
    console.error("댓글 좋아요 중 오류 발생:", error);
    throw error;
  }
};

export const updatePost = async (postId, postData) => {
  try {
    const response = await instance.put(`/api/post/update`, postData, {
      params: { postId }
    });
    return response;
  } catch (error) {
    console.error("게시글 수정 중 오류 발생:", error);
    throw error;
  }
};

export const deletePostImage = async (fileName) => {
  try {
    const response = await instance.delete(`/api/photo/${fileName}`);
    return response.data;
  } catch (error) {
    console.error("게시글 이미지 삭제 중 오류 발생:", error);
    throw error;
  }
};

export const insertReport = async (targetCode, targetId, userEmail, reasonCode) => {
  try {
    const response = await instance.post(`/api/post/report`, null, {
      params: { targetCode, targetId, reporterEmail: userEmail, reasonCode }
    });
    return response;
  } catch (error) {
    console.error("신고 중 오류 발생:", error);
    throw error;
  }
};