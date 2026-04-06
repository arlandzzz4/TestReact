import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getDietByMonth, saveDiet, saveWeight, saveExercise, searchFood,
  getFavMeals, saveFavMeal, deleteFavMeal, getDietDetail,
} from '../api/diet'

// 월별 식단 조회
export const useDietByMonth = (year, month, email) =>
  useQuery({
    queryKey: ['diet', year, month],
    queryFn: () => getDietByMonth(year, month, email),
    // API 연결 전 더미 데이터 (연결 후 삭제)
    placeholderData: {
      '2026-3-1': { weight: '67.2', exercise: true,  meals: { breakfast: [{ name: '오트밀', kcal: 320 }], lunch: [{ name: '닭가슴살 도시락', kcal: 520 }], dinner: [], snack: [] } },
      '2026-3-9': { weight: '66.9', exercise: false, meals: { breakfast: [], lunch: [{ name: '비빔밥', kcal: 650 }], dinner: [{ name: '삼겹살', kcal: 870 }], snack: [{ name: '바나나', kcal: 90 }] } },
      '2026-3-24':{ weight: '66.3', exercise: true,  meals: { breakfast: [{ name: '그릭요거트', kcal: 180 }], lunch: [{ name: '샐러드', kcal: 350 }], dinner: [], snack: [{ name: '견과류', kcal: 160 }] } },
    },
  })

// 식단 저장
export const useSaveDiet = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ dateKey, meals, weight, userEmail }) => saveDiet(dateKey, meals, weight, userEmail),
    onSuccess: (_, { dateKey }) => {
      const [y, m] = dateKey.split('-').map(Number)
      qc.invalidateQueries({ queryKey: ['diet', y, m] })
      qc.invalidateQueries({ queryKey: ['dietDetail'] })  // ← 추가
    },
  })
}

// 체중 저장
export const useSaveWeight = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ dateKey, weight, userEmail }) => saveWeight(dateKey, weight, userEmail),
    onSuccess: (_, { dateKey }) => {
      const [y, m] = dateKey.split('-').map(Number)
      qc.invalidateQueries({ queryKey: ['diet', y, m] })
    },
  })
}

// 운동 체크 저장
export const useSaveExercise = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ dateKey, checked, userEmail }) => saveExercise(dateKey, checked, userEmail),
    onSuccess: (_, { dateKey }) => {
      const [y, m] = dateKey.split('-').map(Number)
      qc.invalidateQueries({ queryKey: ['diet', y, m] })
    },
  })
}

// 음식 검색
export const useFoodSearch = (query) =>
  useQuery({
    queryKey: ['food', query],
    queryFn: () => searchFood(query),
    enabled: !!query,
    // API 연결 전 더미 데이터 (연결 후 삭제)
    
  })

// ── 즐겨 먹는 식단 ──

// 즐겨찾기 목록 조회
export const useFavMeals = (email) =>
  useQuery({
    queryKey: ['favMeals', email],
    queryFn: () => getFavMeals(email),
    enabled: !!email,
    placeholderData: [],
  })

export const useSaveFavMeal = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ name, items, userEmail }) => saveFavMeal(name, items, userEmail),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['favMeals'] }),
  })
}

export const useDeleteFavMeal = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, email }) => deleteFavMeal(id, email),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['favMeals'] }),
  })
}

export const useDietDetail = (date, email) =>
  useQuery({
    queryKey: ['dietDetail', date, email],
    queryFn: () => getDietDetail(date, email),
    enabled: !!date && !!email,
  })

