import { instance } from './axios';

// 게시글 상세 조회
export const getPostDetail = (postId) => {
  return instance.get(`/api/post/${postId}`);
};

// 댓글 목록 조회
export const getCommentList = (postId) => {
  return instance.get(`/api/comment/${postId}`);
};

// 댓글 등록
export const insertComment = (commentData) => {
  return instance.post(`/api/comment`, commentData);
};

// 댓글 삭제
export const deleteComment = (commentId) => {
  return instance.delete(`/api/comment/${commentId}`);
};

// 게시글 수정
export const updatePost = (postId, postData) => {
  return instance.put(`/api/post/${postId}`, postData);
};

// 게시글 삭제
export const deletePost = (postId, userEmail) => {
  return instance.delete(`/api/post/${postId}`, {
    params: { userEmail }
  });
};

// 게시글 좋아요 토글
export const togglePostLike = (postId, userEmail) => {
  return instance.post(`/api/post/${postId}/like`, null, {
    params: { userEmail }
  });
};

// 댓글 좋아요 토글
export const toggleCommentLike = (commentId, userEmail) => {
  return instance.post(`/api/comment/${commentId}/like`, null, {
    params: { userEmail }
  });
};

// 신고 등록
export const insertReport = (targetCode, targetId, reporterEmail, reasonCode) => {
  return instance.post(`/api/post/report`, null, {
    params: { targetCode, targetId, reporterEmail, reasonCode }
  });
};