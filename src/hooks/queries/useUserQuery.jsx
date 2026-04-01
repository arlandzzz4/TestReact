import { useQuery } from '@tanstack/react-query';
import { searchEmail } from '@/api/userApi';

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