import { useQuery } from '@tanstack/react-query';
import { searchReportTotalCount, searchReportTodayCount, searchReportList } from '@/api/reportApi';

export const useReportTotalCountQuery = (searchParams, enabled = true) => {
    return useQuery({
      queryKey: ['reportTotalCnt', searchParams],
      queryFn: ()=>searchReportTotalCount(searchParams),
      enabled: !!searchParams?.targetCode && enabled,
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

export const useReportList = (searchParams, enabled = true) => {
    return useQuery({
      queryKey: ['reports', searchParams],
      queryFn: ()=>searchReportList(searchParams),
      enabled: enabled,
      retry: false,
      staleTime: 1000 * 60 * 5,
    });
}