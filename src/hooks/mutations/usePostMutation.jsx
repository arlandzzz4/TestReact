import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePost } from '@/api/postApi';

export const useDeletePostMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ postId, userEmail }) => deletePost(postId, userEmail),
        onSuccess: () => {
            alert('게시글이 성공적으로 삭제되었습니다.');
            // 'myPosts' 쿼리를 사용하는 모든 곳의 데이터를 무효화하여 리페치를 유도합니다.
            // MyPage에서 useQuery를 사용하도록 리팩토링하면 더욱 효과적입니다.
            queryClient.invalidateQueries({ queryKey: ['myPosts'] });
        },
        onError: (error) => {
            console.error('게시글 삭제 에러:', error);
            alert('게시글 삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
    });
}