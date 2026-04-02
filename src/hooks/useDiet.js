import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getDietByMonth, getDietDetail, saveDiet, saveWeight,
  saveExercise, searchFood, getFavMeals, saveFavMeal, deleteFavMeal
} from '../api/diet'

// 월별 캘린더 조회
export const useDietByMonth = (year, month, user) =>
  useQuery({
    queryKey: ['diet', year, month, user?.email],
    queryFn: () => getDietByMonth(year, month, user),
    enabled: !!user,
  })

// 식단 상세 조회
export const useDietDetail = (date, user) =>
  useQuery({
    queryKey: ['dietDetail', date, user?.email],
    queryFn: () => getDietDetail(date, user),
    enabled: !!user && !!date,
  })

// 식단 저장
export const useSaveDiet = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ dateKey, meals, weight, userEmail }) =>
      saveDiet(dateKey, meals, weight, userEmail),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['diet'] })
      qc.invalidateQueries({ queryKey: ['dietDetail'] })
    },
  })
}

// 체중 저장
export const useSaveWeight = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ dateKey, weight, userEmail }) =>
      saveWeight(dateKey, weight, userEmail),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['diet'] })
    },
  })
}

// 운동 체크 저장
export const useSaveExercise = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ dateKey, checked, userEmail }) =>
      saveExercise(dateKey, checked, userEmail),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['diet'] })
    },
  })
}

// 음식 검색
export const useFoodSearch = (query) =>
  useQuery({
    queryKey: ['food', query],
    queryFn: () => searchFood(query),
    enabled: !!query,
  })

// 즐겨찾기 목록 조회
export const useFavMeals = () =>
  useQuery({
    queryKey: ['favMeals'],
    queryFn: getFavMeals,
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