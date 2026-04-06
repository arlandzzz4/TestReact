import { useMutation } from '@tanstack/react-query';
import { deleteComment } from '@/api/commonApi';

export const useDeleteCommentMutation = () => {
    return useMutation({
        mutationFn: (data) => deleteComment(data),
        onSuccess: () => {
            alert('댓글이 성공적으로 삭제되었습니다.');
        },
        onError: (error) => {
            console.error('댓글 삭제 에러:', error);
            alert('댓글 삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
    });
}