import { useQuery } from '@tanstack/react-query';
import { searchEmail, searchUserTotalCount, searchUserTodayCount } from '@/api/userApi';

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

export const useUserTotalCountQuery = () => {
  const useTotalCountSearch = (enabled = false) => {
    return useQuery({
      queryKey: ['user', 'search'],
      queryFn: () => searchUserTotalCount(),
      enabled: !!email && enabled,
      retry: false,
      staleTime: 1000 * 60 * 5,
    });
  };
  return { useTotalCountSearch };
};

export const useUserTodayCountQuery = () => {
  const useTodayCountSearch = (enabled = false) => {
    return useQuery({
      queryKey: ['user', 'search'],
      queryFn: () => searchUserTodayCount(),
      enabled: !!email && enabled,
      retry: false,
      staleTime: 1000 * 60 * 5,
    });
  };
  return { useTodayCountSearch };
};