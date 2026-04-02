import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { signInWithPopup, signInWithEmailAndPassword, GoogleAuthProvider } from 'firebase/auth';
//import { useAuthStore } from '@/store/useAuthStore';
import { useLoginMutation } from '@/hooks/mutations/useAuthMutation';
import { NavLink } from 'react-router-dom';
import { handleLoginRedirect } from '@/utils/navigation';

const loginSchema = z.object({
  email: z.string().min(1, '이메일을 입력해주세요.').email('올바른 이메일 형식이 아닙니다.'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLoginMutation();
  const [isLoading, setIsLoading] = useState({ google: false, basic: false });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  // 일반 이메일 로그인 핸들러
  const onBasicLogin = async (data) => {
    console.log("전체 데이터:", data);
    setIsLoading((prev) => ({ ...prev, basic: true }));
    try {
      const result = await signInWithEmailAndPassword(auth, data.email, data.password);
      const token = await result.user.getIdToken();
      const user = {
          "email" : result.user.email,
          "password" : data.password,
          "providerCode" : "01",
          "providerId" : result.user.uid
        }
      loginMutation.mutate({ 
        userData: { ...user }, 
        token: token 
      });
      handleLoginRedirect(navigate, location);
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
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);//googleProvider
      console.log("user : " , result.user);
      if (result.user) {
        const idToken = await result.user.getIdToken();
        const user = {
          "email" : result.user.email,
          "nickname" : result.user.displayName,
          "providerCode" : "02",
          "providerId" : result.user.uid
        }
        loginMutation.mutate({ 
          userData: { ...user }, 
          token: idToken 
        });
        handleLoginRedirect(navigate, location);
      }
    } catch (error) {
      //console.error("구글 상세 에러:", error.code, error.message);
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
                      <h1 className="fw-bold" style={{ color: '#3d6b4f', textDecoration: 'underline'}}>LOGIN</h1>
                    </div>

                    {/* 이메일 입력 섹션 */}
                    <div className="mb-1">
                      <CInputGroup className="has-validation">
                        <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                        <CFormInput
                          placeholder="이메일을 입력하세요."
                          invalid={!!errors.email}
                          {...register('email')}
                        />
                        <div 
                          className="invalid-feedback d-block" 
                          style={{ 
                            minHeight: '18px', 
                            visibility: errors.email ? 'visible' : 'hidden', // 에러가 없어도 공간은 유지
                            marginTop: '0.25rem',
                            fontSize: '0.7em'
                          }}
                        >
                          {errors.email?.message}
                        </div>
                      </CInputGroup>
                    </div>

                    {/* 비밀번호 입력 섹션 */}
                    <div className="mb-1">
                      <CInputGroup className="has-validation">
                        <CInputGroupText><CIcon icon={cilLockLocked} /></CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="비밀번호를 입력하세요."
                          {...register('password')}
                          invalid={!!errors.password}
                          name="password"
                        />
                        <CFormFeedback invalid className={errors.password ? 'd-block' : ''}>
                          {errors.password?.message}
                        </CFormFeedback>
                      </CInputGroup>
                    </div>

                    <div className="d-grid gap-2 mt-4">
                      <CButton size="lg" type="submit" disabled={isLoading.basic} style={{ color: '#FFF', backgroundColor: '#3d6b4f', border: '1px solid #3d6b4f', fontWeight: 'bold' }}>
                        {isLoading.basic ? <CSpinner size="sm" /> : '로그인'}
                      </CButton>
                    </div>

                    <div className="my-4 d-flex align-items-center">
                      <hr className="flex-grow-1" style={{ border: '1px solid #3d6b4f', fontWeight: 'bold' }}/>
                      <span className="px-3 text-medium-emphasis small">또는 소셜 계정으로 로그인</span>
                      <hr className="flex-grow-1" style={{ border: '1px solid #3d6b4f', fontWeight: 'bold' }}/>
                    </div>

                    <div className="d-grid">
                      <CButton
                        type="button"
                        disabled={isLoading.google}
                        onClick={onGoogleLogin}
                        className="d-flex align-items-center justify-content-center gap-2 w-100"
                        style={{ 
                          border: '1px solid #e0e0e0', 
                          backgroundColor: '#F2F2F2',
                          color: '#3c4043', 
                          fontWeight: '600',
                          fontSize: '14px',    // 글자 크기 축소
                          padding: '8px 16px', // 버튼 높이 축소
                          borderRadius: '4px'
                        }}
                      >
                        {isLoading.google ? (
                          <CSpinner size="sm" />
                        ) : (
                          /* 컬러 구글 마크 (SVG 이미지 사용) */
                          <img 
                            src="https://developers.google.com/static/identity/images/branding_guideline_sample_nt_rd_sl.svg?hl=ko" 
                            alt="Google" 
                            style={{ width: '24px', height: '24px', flexShrink: 0 }}
                          />
                        )}
                        구글
                      </CButton>
                    </div>

                    <div className="text-center mt-3">
                      <span style={{ color: '#6c757d', marginRight: '5px', fontSize: '13px' }}>
                        아직 계정이 없으신가요?
                      </span>
                      <NavLink 
                        to="/agreement" 
                        style={{ 
                          color: '#3d6b4f', 
                          fontWeight: 'bold', 
                          textDecoration: 'none',
                          fontSize: '13px' 
                        }}
                      >
                        회원가입
                      </NavLink>
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