import { useMutation } from '@tanstack/react-query';
import { deletePost } from '@/api/postApi';

export const useDeletePostMutation = () => {
    return useMutation({
        mutationFn: (data) => deletePost(data),
        onSuccess: () => {
            alert('게시글이 성공적으로 삭제되었습니다.');
        },
        onError: (error) => {
            console.error('게시글 삭제 에러:', error);
            alert('게시글 삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
    });
}