import { useQuery } from '@tanstack/react-query';
import { searchEmail, searchUserTotalCount, searchUserTodayCount, searchUserList } from '@/api/userApi';
 
export const useUserQuery = () => {
  const useEmailSearch = (email, enabled = false) => {
    return useQuery({
      queryKey: ['user', 'search', email],
      queryFn: () => searchEmail(email),
      enabled: !!email && enabled,
      retry: false,
      staleTime: 1000 * 60 * 5,
    });
  };
  return { useEmailSearch };
};

export const useUserTotalCountQuery = (enabled = true) => {
    return useQuery({
      queryKey: ['totalCnt'],
      queryFn: ()=>searchUserTotalCount(),
      enabled: enabled,
      retry: false,
      staleTime: 1000 * 60 * 5,
    });
};

export const useUserTodayCountQuery = (enabled = true) => {
    return useQuery({
      queryKey: ['todayCnt'],
      queryFn: ()=>searchUserTodayCount(),
      enabled: enabled,
      retry: false,
      staleTime: 1000 * 60 * 5,
    });
};

export const useUserList = (searchParams, enabled = true) => {
    return useQuery({
      queryKey: ['users', searchParams],
      queryFn: ()=>searchUserList(searchParams),
      enabled: enabled,
      retry: false,
      staleTime: 1000 * 60 * 5,
    });
};