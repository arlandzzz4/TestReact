import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getDietByMonth, saveDiet, saveWeight, saveExercise, searchFood,
  getFavMeals, saveFavMeal, deleteFavMeal,
} from '../api/diet'

// 월별 식단 조회
export const useDietByMonth = (year, month) =>
  useQuery({
    queryKey: ['diet', year, month],
    queryFn: () => getDietByMonth(year, month),
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
    mutationFn: ({ dateKey, meals, weight }) => saveDiet(dateKey, meals, weight),
    onSuccess: (_, { dateKey }) => {
      const [y, m] = dateKey.split('-').map(Number)
      qc.invalidateQueries({ queryKey: ['diet', y, m] })
    },
  })
}

// 체중 저장
export const useSaveWeight = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ dateKey, weight }) => saveWeight(dateKey, weight),
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
    mutationFn: ({ dateKey, checked }) => saveExercise(dateKey, checked),
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
    placeholderData: [
      { name: '현미밥', kcal: 300, unit: '1공기(200g)' },
      { name: '닭가슴살 구이', kcal: 165, unit: '100g' },
      { name: '계란후라이', kcal: 90, unit: '1개' },
      { name: '바나나', kcal: 89, unit: '1개(100g)' },
      { name: '고구마', kcal: 128, unit: '100g' },
      { name: '아메리카노', kcal: 10, unit: '1잔(350ml)' },
      { name: '김치찌개', kcal: 180, unit: '1인분' },
      { name: '된장찌개', kcal: 150, unit: '1인분' },
      { name: '비빔밥', kcal: 570, unit: '1인분' },
      { name: '불고기', kcal: 280, unit: '100g' },
    ],
  })

// ── 즐겨 먹는 식단 ──

// 즐겨찾기 목록 조회
export const useFavMeals = () =>
  useQuery({
    queryKey: ['favMeals'],
    queryFn: getFavMeals,
    // API 연결 전 더미 데이터 (연결 후 삭제)
    placeholderData: [],
  })

// 즐겨찾기 저장
export const useSaveFavMeal = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ name, items }) => saveFavMeal(name, items),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['favMeals'] }),
  })
}

// 즐겨찾기 삭제
export const useDeleteFavMeal = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => deleteFavMeal(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['favMeals'] }),
  })
}

