import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import {
  getDietByMonth, searchFood, getFavMeals, getDietDetail
} from '../../api/diet'

// 월별 식단 조회
export const useDietByMonth = (year, month, email) =>
  useQuery({
    queryKey: ['diet', year, month],
    queryFn: () => getDietByMonth(year, month, email),
    placeholderData: {},
  })

// 음식 검색 (무한 스크롤)
export const useFoodSearch = (query) =>
  useInfiniteQuery({
    queryKey: ['food', query],
    queryFn: ({ pageParam = 0 }) => searchFood(query, pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 30 ? allPages.length : undefined,
    enabled: !!query,
  })

// 즐겨찾기 목록 조회
export const useFavMeals = (email) =>
  useQuery({
    queryKey: ['favMeals', email],
    queryFn: () => getFavMeals(email),
    enabled: !!email,
    placeholderData: [],
  })

// 식단 상세 조회
export const useDietDetail = (date, email) =>
  useQuery({
    queryKey: ['dietDetail', date, email],
    queryFn: () => getDietDetail(date, email),
    enabled: !!date && !!email,
  })