import { useQuery } from '@tanstack/react-query';
import { searchEmail, searchUserTotalCount, searchUserTodayCount, searchUserList, searchNickname } from '@/api/userApi';
 
export const useUserQuery = () => {
  const useEmailSearch = (email, enabled = false) => {
    return useQuery({
      queryKey: ['user', 'search', email],
      queryFn: () => searchEmail(email),
      enabled: !!email && enabled,
      retry: false,
      staleTime: 0,
    });
  };
  return { useEmailSearch };
};

export const useUserTotalCountQuery = (searchParams, enabled = true) => {
    return useQuery({
      queryKey: ['totalCnt', searchParams],
      queryFn: ()=>searchUserTotalCount(searchParams),
      enabled: enabled,
      retry: false,
      staleTime: 1000 * 30,
    });
};

export const useUserTodayCountQuery = (enabled = true) => {
    return useQuery({
      queryKey: ['todayCnt'],
      queryFn: ()=>searchUserTodayCount(),
      enabled: enabled,
      retry: false,
      staleTime: 1000 * 30,
    });
};

export const useUserList = (searchParams, enabled = true) => {
    return useQuery({
      queryKey: ['users', searchParams],
      queryFn: ()=>searchUserList(searchParams),
      enabled: enabled,
      retry: false,
      staleTime: 1000 * 30,
    });
};

export const useNicknameQuery = (nickname, enabled = false) => {
    return useQuery({
      queryKey: ['nickname', nickname],
      queryFn: () => searchNickname(nickname),
      enabled: !!nickname && enabled,
      retry: false,
      staleTime: 0,
    });
  };