import { useQuery } from '@tanstack/react-query';
import { searchCommentTotalCount, searchCommentTodayCount, searchCommentList} from '@/api/commentApi';


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

export const useCommentList = (searchParams, enabled = true) => {
    return useQuery({
      queryKey: ['comments', searchParams],
      queryFn: ()=>searchCommentList(searchParams),
      enabled: enabled,
      retry: false,
      staleTime: 1000 * 60 * 5,
    });
};
