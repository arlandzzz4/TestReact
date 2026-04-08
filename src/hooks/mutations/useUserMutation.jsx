import { useMutation } from '@tanstack/react-query';
import { updateUserStatusCode, unsubscribe } from '@/api/userApi';
import { auth, googleProvider } from '@/config/firebase';
import { 
  EmailAuthProvider, 
  reauthenticateWithCredential, 
  reauthenticateWithPopup 
} from 'firebase/auth';
import { getMessaging, deleteToken } from "firebase/messaging";
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);
    return useMutation({
        //withdrawData = email, providerCode, providerId, reason
        mutationFn: async (withdrawData) => {
        const user = auth.currentUser;
        if (!user) throw new Error("USER_NOT_FOUND");

        // 1. 보안 재인증 (Firebase 계정 삭제 전 필수 단계)
        const provider = user.providerData[0]?.providerId;

        if (provider === 'google.com') {
            await reauthenticateWithPopup(user, googleProvider);
        } else if (provider === 'password' && withdrawData.currentPassword) {
            const credential = EmailAuthProvider.credential(user.email, withdrawData.currentPassword);
            await reauthenticateWithCredential(user, credential);
        }
        // 2. FCM 토큰 무효화
        try {
            const messaging = getMessaging();
            await deleteToken(messaging);
            console.log("FCM 토큰 무효화 성공");
        } catch (fcmError) {
            console.warn("FCM 토큰 삭제 실패(이미 없거나 권한 문제):", fcmError);
        }
        // 3. 백엔드 데이터 삭제 (Axios 호출)
        const response = await unsubscribe(withdrawData);

        // 4. Firebase Auth 유저 삭제
        await user.delete();

        return response;
        },
        onSuccess: () => {
            alert('유저가 성공적으로 탈퇴되었습니다.');
            logout(); 
            navigate('/login', { replace: true });
        },
        onError: (error) => {
            console.error('유저 탈퇴 에러:', error);
      
            if (error.code === 'auth/wrong-password') {
                alert('현재 비밀번호가 일치하지 않습니다.');
            } else if (error.code === 'auth/requires-recent-login') {
                alert('보안을 위해 다시 로그인한 후 탈퇴를 진행해주세요.');
            } else {
                alert('유저 탈퇴 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            }
        }
    });
}