import { useQuery } from '@tanstack/react-query';
import { searchReportTotalCount, searchReportTodayCount } from '@/api/reportApi';

export const useReportTotalCountQuery = (enabled = true) => {
    return useQuery({
      queryKey: ['reportTotalCnt'],
      queryFn: ()=>searchReportTotalCount(),
      enabled: enabled,
      retry: false,
      staleTime: 1000 * 60 * 5,
    });
};

export const useReportTodayCountQuery = (enabled = true) => {
    return useQuery({
      queryKey: ['reportTodayCnt'],
      queryFn: ()=>searchReportTodayCount(),
      enabled: enabled,
      retry: false,
      staleTime: 1000 * 60 * 5,
    });
};