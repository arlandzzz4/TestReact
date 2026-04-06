import { instance } from './axios.jsx';

export const getChallengeList = async (userEmail) => {
  try {
    const response = await instance.get('/api/challenge', { params: { userEmail } });
    return response.data;
  } catch (error) {
    console.error("챌린지 목록 조회 실패:", error);
    throw error;
  }
};

export const createChallenge = async (challengeData) => {
  try {
    const response = await instance.post('/api/challenge', challengeData);
    return response.data;
  } catch (error) {
    console.error("챌린지 등록 실패:", error);
    throw error;
  }
};

export const deleteChallenge = async (id, userEmail) => {
  try {
    const response = await instance.delete(`/api/challenge/${id}`, { params: { userEmail } });
    return response.data;
  } catch (error) {
    console.error("챌린지 삭제 실패:", error);
    throw error;
  }
};

export const verifyChallenge = async (challengeId, checkedDate) => {
  try {
    const response = await instance.post(
      `/api/challenge/${challengeId}/verify`,
      { checkedDate },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    console.error("인증 실패:", error);
    throw error;
  }
};