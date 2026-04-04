import { useQuery } from '@tanstack/react-query';
import { searchPostTotalCount, searchPostTodayCount, searchCommentTotalCount, searchCommentTodayCount, searchPostList} from '@/api/postApi';

export const usePostTotalCountQuery = (enabled = true) => {
    return useQuery({
      queryKey: ['PostTotalCnt'],
      queryFn: ()=>searchPostTotalCount(),
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

export const useCommentTotalCountQuery = (enabled = true) => {
    return useQuery({
      queryKey: ['commentTotalCnt'],
      queryFn: ()=>searchCommentTotalCount(),
      enabled: enabled,
      retry: false,
      staleTime: 1000 * 60 * 5,
    });
};

export const useCommentTodayCountQuery = (enabled = true) => {
    return useQuery({
      queryKey: ['commentTodayCnt'],
      queryFn: ()=>searchCommentTodayCount(),
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