import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  saveDiet, saveWeight, saveExercise, saveFavMeal, deleteFavMeal
} from '../../api/diet'

// 식단 저장
export const useSaveDiet = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ dateKey, meals, weight, userEmail }) => saveDiet(dateKey, meals, weight, userEmail),
    onSuccess: (_, { dateKey }) => {
      const [y, m] = dateKey.split('-').map(Number)
      qc.invalidateQueries({ queryKey: ['diet', y, m] })
      qc.invalidateQueries({ queryKey: ['dietDetail'] })
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

// 즐겨찾기 저장
export const useSaveFavMeal = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ name, items, userEmail }) => saveFavMeal(name, items, userEmail),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['favMeals'] }),
  })
}

// 즐겨찾기 삭제
export const useDeleteFavMeal = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, email }) => deleteFavMeal(id, email),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['favMeals'] }),
  })
}