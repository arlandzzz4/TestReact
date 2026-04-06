import { useQuery } from '@tanstack/react-query';
import { searchPostTotalCount, searchPostTodayCount, searchCommentTotalCount, searchCommentTodayCount, searchPostList, searchCommentList} from '@/api/postApi';

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

export const useCommentTotalCountQuery = (searchParams, enabled = true) => {
    return useQuery({
      queryKey: ['commentTotalCnt', searchParams],
      queryFn: ()=>searchCommentTotalCount(searchParams),
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

export const useCommentList = (searchParams, enabled = true) => {
    return useQuery({
      queryKey: ['posts', searchParams],
      queryFn: ()=>searchCommentList(searchParams),
      enabled: enabled,
      retry: false,
      staleTime: 1000 * 60 * 5,
    });
};
