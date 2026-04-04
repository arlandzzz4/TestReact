import { useQuery } from '@tanstack/react-query';
import { searchCodeGroup } from '@/api/commonApi';
 
export const useCodeGroupSearch = (codeGroup, enabled = true) => {
    return useQuery({
      queryKey: ['codeGroup', codeGroup],
      queryFn: () => searchCodeGroup(codeGroup),
      enabled: enabled,
      retry: false,
      staleTime: 1000 * 60 * 5,
      select: (data) => {
        if (!Array.isArray(data)) return {};
        return data.reduce((acc, cur) => {
            acc[cur.groupName] = cur.groupCode; 
            return acc;
        }, {});
    },
    });
};