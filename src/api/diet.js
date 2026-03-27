import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

// 월별 식단 + 체중 + 운동 데이터 조회
export const getDietByMonth = (year, month) =>
  axios.get(`${BASE_URL}/api/diet`, { params: { year, month } }).then(r => r.data)

// 특정 날짜 식단 저장
export const saveDiet = (dateKey, meals, weight) =>
  axios.post(`${BASE_URL}/api/diet`, { dateKey, meals, weight }).then(r => r.data)

// 체중만 저장
export const saveWeight = (dateKey, weight) =>
  axios.patch(`${BASE_URL}/api/diet/weight`, { dateKey, weight }).then(r => r.data)

// 운동 체크 저장
export const saveExercise = (dateKey, checked) =>
  axios.patch(`${BASE_URL}/api/diet/exercise`, { dateKey, checked }).then(r => r.data)

// 음식 검색
export const searchFood = (query) =>
  axios.get(`${BASE_URL}/api/food/search`, { params: { q: query } }).then(r => r.data)

// ── 즐겨 먹는 식단 ──
// 즐겨찾기 목록 조회
export const getFavMeals = () =>
  axios.get(`${BASE_URL}/api/fav-meals`).then(r => r.data)

// 즐겨찾기 저장
export const saveFavMeal = (name, items) =>
  axios.post(`${BASE_URL}/api/fav-meals`, { name, items }).then(r => r.data)

// 즐겨찾기 삭제
export const deleteFavMeal = (id) =>
  axios.delete(`${BASE_URL}/api/fav-meals/${id}`).then(r => r.data)

