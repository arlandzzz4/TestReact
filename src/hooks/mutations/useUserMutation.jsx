import { useMutation } from '@tanstack/react-query';
import { updateUserStatusCode } from '@/api/userApi';

export const useUpdateUserStatusCodeMutation = () => {
    return useMutation({
        mutationFn: updateUserStatusCode,
        onSuccess: () => {
            alert('유저 상태가 성공적으로 업데이트되었습니다.');
        },
        onError: (error) => {
            console.error('유저 상태 업데이트 에러:', error);
            alert('유저 상태 업데이트 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
    });
}