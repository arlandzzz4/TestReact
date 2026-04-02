import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

// 월별 캘린더 조회 — POST + user 정보
export const getDietByMonth = (year, month, user) =>
  axios.post(`${BASE_URL}/api/calendar/diet`, user, {
    params: { year, month }
  }).then(r => r.data)

// 식단 상세 조회 — POST + user 정보
export const getDietDetail = (date, user) =>
  axios.post(`${BASE_URL}/api/calendar/diet/detail`, user, {
    params: { date }
  }).then(r => r.data)

// 식단 저장
export const saveDiet = (dateKey, meals, weight, userEmail) =>
  axios.post(`${BASE_URL}/api/calendar/diet/save`, {
    userEmail,
    dateKey,
    meals,
    weight
  }).then(r => r.data)

// 체중 저장
export const saveWeight = (dateKey, weight, userEmail) =>
  axios.patch(`${BASE_URL}/api/calendar/diet/weight`, {
    userEmail,
    dateKey,
    weight
  }).then(r => r.data)

// 운동 체크 저장
export const saveExercise = (dateKey, checked, userEmail) =>
  axios.patch(`${BASE_URL}/api/calendar/diet/exercise`, {
    userEmail,
    dateKey,
    checked
  }).then(r => r.data)

// 음식 검색
export const searchFood = (query) =>
  axios.get(`${BASE_URL}/api/calendar/food/search`, {
    params: { q: query }
  }).then(r => r.data)

  // ── 즐겨 먹는 식단 (로컬스토리지 기반) ──
const FAV_KEY = 'iob_fav_meals'

export const getFavMeals = () => {
  try {
    const data = localStorage.getItem(FAV_KEY)
    return Promise.resolve(data ? JSON.parse(data) : [])
  } catch { return Promise.resolve([]) }
}

export const saveFavMeal = (name, items) => {
  try {
    const existing = JSON.parse(localStorage.getItem(FAV_KEY) || '[]')
    const newFav = { id: Date.now(), name, items }
    localStorage.setItem(FAV_KEY, JSON.stringify([...existing, newFav]))
    return Promise.resolve(newFav)
  } catch { return Promise.reject(new Error('저장 실패')) }
}

export const deleteFavMeal = (id) => {
  try {
    const existing = JSON.parse(localStorage.getItem(FAV_KEY) || '[]')
    localStorage.setItem(FAV_KEY, JSON.stringify(existing.filter(f => f.id !== id)))
    return Promise.resolve()
  } catch { return Promise.reject(new Error('삭제 실패')) }
}