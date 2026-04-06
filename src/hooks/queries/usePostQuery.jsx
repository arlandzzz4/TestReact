import { useQuery } from '@tanstack/react-query';
import { searchPostTotalCount, searchPostTodayCount, searchPostList } from '@/api/postApi';

export const usePostTotalCountQuery = (searchParams, enabled = true) => {
    return useQuery({
      queryKey: ['PostTotalCnt', searchParams],
      queryFn: ()=>searchPostTotalCount(searchParams),
      enabled: enabled,
      retry: false,
      staleTime: 1000 * 60 * 5,
    });
};

export const usePostTodayCountQuery = (enabled = true) => {
    return useQuery({
      queryKey: ['postTodayCnt'],
      queryFn: ()=>searchPostTodayCount(),
      enabled: enabled,
      retry: false,
      staleTime: 1000 * 60 * 5,
    });
};

export const usePostList = (searchParams, enabled = true) => {
    return useQuery({
      queryKey: ['posts', searchParams],
      queryFn: ()=>searchPostList(searchParams),
      enabled: enabled,
      retry: false,
      staleTime: 1000 * 60 * 5,
    });
};

