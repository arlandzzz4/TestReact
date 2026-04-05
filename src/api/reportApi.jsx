import { instance } from './axios.jsx';

export const searchReportTotalCount = async (data) => {
  try {
    const response = await instance.get(`/api/report/search/totalcnt`, { params: data });
    return response.data;
  } catch (error) {
    console.error("미처리 신고 중 오류 발생:", error);
    throw error;
  }
};

export const searchReportTodayCount = async () => {
  try {
    const response = await instance.get(`/api/report/search/todaycnt`);
    return response.data;
  } catch (error) {
    console.error("오늘 게시글 조회 중 오류 발생:", error);
    throw error;
  }
};

export const searchReportList = async (data) => {
  try {
    const response = await instance.get(`/api/report/search/report`, {params : data});
    return response.data;
  } catch (error) {
    console.error("신고 조회 중 오류 발생:", error);
    throw error;
  }
};
