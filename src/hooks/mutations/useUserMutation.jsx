import { useMutation } from '@tanstack/react-query';
import { updateUserStatusCode, unsubscribe } from '@/api/userApi';
import { getMessaging, deleteToken } from "firebase/messaging";

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

export const useUnsubscribe = () => {
    return useMutation({
        //withdrawData = email, providerCode, providerId, reason
        mutationFn: async (withdrawData) => {
        // 파이어베이스 삭제
        try {
            const messaging = getMessaging();
            await deleteToken(messaging);
            console.log("FCM 토큰 무효화 성공");
        } catch (fcmError) {
            console.warn("FCM 토큰 삭제 실패(이미 없거나 권한 문제):", fcmError);
        }

        //axios 호출
        return await unsubscribe(withdrawData);
        },
        onSuccess: () => {
            alert('유저가 성공적으로 탈퇴되었습니다.');
        },
        onError: (error) => {
            console.error('유저 탈퇴 에러:', error);
            alert('유저 탈퇴 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
    });
}