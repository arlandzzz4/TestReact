import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  CButton, CCard, CCardBody, CCardGroup, CCol, CContainer,
  CForm, CFormInput, CInputGroup, CInputGroupText, CRow, CSpinner, CFormFeedback
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser, cibGoogle } from '@coreui/icons';
import { auth, googleProvider } from '@/config/firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * 1. Zod 스키마 정의: 유효성 검사 규칙 설정
 */
const loginSchema = z.object({
  email: z.string().min(1, '이메일을 입력해주세요.').email('올바른 이메일 형식이 아닙니다.'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
});

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState({ google: false, basic: false });

  /**
   * 2. react-hook-form 설정
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onChange', // 실시간 검증 활성화
  });

  // 일반 이메일 로그인 핸들러
  const onBasicLogin = async (data) => {
    setIsLoading((prev) => ({ ...prev, basic: true }));
    try {
      const result = await signInWithEmailAndPassword(auth, data.email, data.password);
      const token = await result.user.getIdToken();
      login(result.user, token);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('이메일 또는 비밀번호가 일치하지 않습니다.');
    } finally {
      setIsLoading((prev) => ({ ...prev, basic: false }));
    }
  };

  // 구글 로그인 핸들러
  const onGoogleLogin = async () => {
  if (isLoading.google) return;
  setIsLoading((prev) => ({ ...prev, google: true }));
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // ... 성공 로직
  } catch (error) {
    console.error("🔥 구글 상세 에러:", error.code, error.message); // 👈 이걸 확인해야 합니다!
    
    if (error.code === 'auth/operation-not-allowed') {
      alert('Firebase 콘솔에서 Google 로그인을 활성화해주세요.');
    } else if (error.code === 'auth/unauthorized-domain') {
      alert('현재 도메인이 Firebase에 등록되지 않았습니다.');
    } else {
      alert(`로그인 실패: ${error.code}`);
    }
  } finally {
    setIsLoading((prev) => ({ ...prev, google: false }));
  }
};

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <CContainer>
        <CRow className="justify-content-center align-items-center">
          <CCol md={8} lg={6} xl={5}>
            <CCardGroup>
              <CCard className="p-4 shadow-sm" style={{ borderRadius: '15px' }}>
                <CCardBody>
                  <CForm onSubmit={handleSubmit(onBasicLogin)}>
                    <div className="text-center mb-4">
                      <h1 className="fw-bold">로그인</h1>
                      <p className="text-medium-emphasis">계정에 로그인하세요</p>
                    </div>

                    {/* 이메일 입력 섹션 */}
                    <div className="mb-3">
                      <CInputGroup className="has-validation">
                        <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                        <CFormInput
                          placeholder="Email"
                          invalid={!!errors.email}
                          {...register('email')}
                        />
                        <CFormFeedback invalid>{errors.email?.message}</CFormFeedback>
                      </CInputGroup>
                    </div>

                    {/* 비밀번호 입력 섹션 */}
                    <div className="mb-4">
                      <CInputGroup className="has-validation">
                        <CInputGroupText><CIcon icon={cilLockLocked} /></CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Password"
                          invalid={!!errors.password}
                          {...register('password')}
                        />
                        <CFormFeedback invalid>{errors.password?.message}</CFormFeedback>
                      </CInputGroup>
                    </div>

                    <div className="d-grid gap-2">
                      <CButton color="primary" size="lg" type="submit" disabled={isLoading.basic} style={{ border: '1px solid #e0e0e0', fontWeight: 'bold' }}>
                        {isLoading.basic ? <CSpinner size="sm" /> : '로그인'}
                      </CButton>
                    </div>

                    <div className="my-4 d-flex align-items-center">
                      <hr className="flex-grow-1" />
                      <span className="px-3 text-medium-emphasis small">또는</span>
                      <hr className="flex-grow-1" />
                    </div>

                    <div className="d-grid">
                      <CButton
                        type="button"
                        color="danger"
                        variant="outline"
                        size="lg"
                        onClick={onGoogleLogin}
                        disabled={isLoading.google}
                        className="d-flex align-items-center justify-content-center gap-2"
                        style={{ border: '1px solid #e0e0e0', color: '#000000', fontWeight: 'bold' }}
                      >
                        {isLoading.google ? <CSpinner size="sm" /> : <CIcon icon={cibGoogle} size="lg" />}
                        Google 로그인
                      </CButton>
                    </div>

                    <div className="d-grid">
                      <CButton>
                        아직 계정이 없으신가요? 회원가입
                      </CButton>
                    </div>

                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;