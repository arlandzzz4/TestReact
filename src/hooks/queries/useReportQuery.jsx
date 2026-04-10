import { useQuery } from '@tanstack/react-query';
import { searchReportTotalCount, searchReportTodayCount, searchReportList, updateReportStatusCode } from '@/api/reportApi';

export const useReportTotalCountQuery = (searchParams, enabled = true) => {
    return useQuery({
      queryKey: ['reportTotalCnt', searchParams],
      queryFn: ()=>searchReportTotalCount(searchParams),
      enabled: enabled && searchParams !== undefined,
      retry: false,
      staleTime: 1000 * 60 * 5,
    });
};

export const useReportTodayCountQuery = (searchParams, enabled = true) => {
    return useQuery({
      queryKey: ['reportTodayCnt', searchParams],
      queryFn: ()=>searchReportTodayCount(searchParams),
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
};

export const useUpdateReportStatusCode = (searchParams, enabled = true) => {
    return useQuery({
      queryKey: ['reportStatus', searchParams],
      queryFn: ()=>updateReportStatusCode(searchParams),
      enabled: enabled,
      retry: false,
      staleTime: 1000 * 60 * 5,
    });
};