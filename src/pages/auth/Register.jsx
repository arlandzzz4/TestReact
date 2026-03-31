import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  CButton, CCard, CCardBody, CCardGroup, CCol, CContainer,
  CForm, CFormInput, CInputGroup, CInputGroupText, CRow, CSpinner, CFormFeedback,
  CFormLabel,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser, cibGoogle } from '@coreui/icons';
import { auth, googleProvider } from '@/config/firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { NavLink } from 'react-router-dom'

export const signupSchema = z
  .object({
    email: z.string().email("올바른 이메일 형식이 아닙니다."),
    password: z.string()
      .min(8, "최소 8자 이상 입력해주세요.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        "대소문자, 숫자, 특수문자를 모두 포함해야 합니다."
      ),
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요."),
    nickname: z.string().min(2, "닉네임은 2자 이상이어야 합니다."),
    terms: z.literal("Y", {
      errorMap: () => ({ message: "이용약관에 동의해야 합니다." }),
    }),
    privacy: z.literal("Y", {
      errorMap: () => ({ message: "개인정보 수집에 동의해야 합니다." }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"], // 에러 메시지를 어느 필드에 표시할지 지정 (중요!)
  });


const RegisterPage = () => {
  const location = useLocation();
  const { terms, privacy } = location.state || {};
  const navigate = useNavigate();
  const regist = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState({ google: false, basic: false });
  const { 
    register, 
    handleSubmit, 
    watch,
    trigger,
    formState: { errors, isValid }
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: 'onChange'
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  useEffect(() => {
    if (confirmPassword && confirmPassword.length > 0) {
      trigger("confirmPassword");
    }
  }, [password, trigger]);

  // 버튼 스타일 동적 결정
  const buttonStyle = {
    backgroundColor: isValid ? '#3d6b4f' : '#b2b2b2', // [핵심]: 통과 시 녹색, 미통과 시 회색
    border: 'none',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: '8px',
    padding: '12px',
    transition: 'background-color 0.3s ease' // 색상 변할 때 부드럽게 애니메이션
  };
  

  // 공통 스타일 정의
  const inputStyle = { backgroundColor: '#eeeeee', border: 'none', borderRadius: '8px', padding: '12px' };
  const labelStyle = { fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' };
  const errorSpaceStyle = (fieldError) => ({
    minHeight: '20px',
    fontSize: '12px',
    color: '#e55353',
    marginTop: '4px',
    textAlign: 'right', // 시안처럼 우측 정렬
    visibility: fieldError ? 'visible' : 'hidden'
  });

  //일반 등록
  const onRegister = async (data) => {
    setIsLoading((prev) => ({ ...prev, basic: true }));
    try {
      const result = await signInWithEmailAndPassword(auth, data.email, data.password);
      const token = await result.user.getIdToken();
      const user = {
        "email" : result.user.email,
        "password" : result.user.password,
        "nickname" : result.user.nickname,
        "providerCode" : "01",
        "providerId" : result.user.uid,
        "termsAgreedYn" : terms,
        "privacyAgreedYn" : privacy,
      }
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~" , user);
      //await regist(user, token);
      //navigate("/", { replace: true });
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('이메일 또는 비밀번호가 일치하지 않습니다.');
    } finally {
      setIsLoading((prev) => ({ ...prev, basic: false }));
    }
  };

  // 구글 등록 핸들러
  const onGoogleLogin = async () => {
    if (isLoading.google) return;
    setIsLoading((prev) => ({ ...prev, google: true }));
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const user = {
        "email" : result.user.email,
        "nickname" : result.user.displayName,
        "providerCode" : "02",
        "providerId" : result.user.uid,
        "termsAgreedYn" : terms,
        "privacyAgreedYn" : privacy,
      }
      await regist(user, idToken);
      navigate("", { replace: true });
    } catch (error) {
      console.error(" 구글 상세 에러:", error.code, error.message);
      
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
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f4f1ea' }}>
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={7} lg={6} xl={5}>
            <CCard className="p-4 border-0 shadow-sm" style={{ borderRadius: '20px' }}>
              <CCardBody>
                {/* 타이틀 섹션 */}
                <div className="text-center mb-5">
                  <h2 className="fw-bold" style={{ color: '#3d6b4f', display: 'inline-block', borderBottom: '3px solid #3d6b4f', paddingBottom: '10px' }}>
                    회원 가입
                  </h2>
                </div>

                <CForm onSubmit={handleSubmit(onRegister)}>
                  {/* 이메일 섹션 */}
                  <div className="mb-2">
                    <CFormLabel style={labelStyle}>이메일</CFormLabel>
                    <CInputGroup>
                      <CFormInput style={inputStyle} placeholder="example@job.kr" {...register('email')} invalid={!!errors.email} />
                      <CButton type="button" style={{ backgroundColor: '#e9f5ee', color: '#3d6b4f', border: 'none', marginLeft: '10px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px' }}>
                        사용 확인
                      </CButton>
                    </CInputGroup>
                    <div style={errorSpaceStyle(errors.email)}>* {errors.email?.message || '해당 이메일은 사용 불가합니다'}</div>
                  </div>

                  {/* 비밀번호 섹션 */}
                  <div className="mb-2">
                    <CFormLabel style={labelStyle}>비밀번호 <span style={{fontSize: '10px', fontWeight: 'normal', color: '#888'}}>(8~20자, 영문, 숫자 포함)</span></CFormLabel>
                    <CFormInput type="password" style={inputStyle} {...register('password')} invalid={!!errors.password} />
                    <div style={errorSpaceStyle(errors.password)}>* {errors.password?.message || '조건이 일치하지 않습니다'}</div>
                  </div>

                  {/* 비밀번호 확인 섹션 */}
                  <div className="mb-2">
                    <CFormLabel style={labelStyle}>비밀번호 중복 확인</CFormLabel>
                    <CFormInput type="password" style={inputStyle} {...register('confirmPassword')} invalid={!!errors.confirmPassword} />
                    <div style={errorSpaceStyle(errors.confirmPassword)}>* {errors.confirmPassword?.message || '비밀번호가 일치하지 않습니다'}</div>
                  </div>

                  {/* 닉네임 섹션 */}
                  <div className="mb-4">
                    <CFormLabel style={labelStyle}>닉네임</CFormLabel>
                    <CFormInput style={inputStyle} placeholder="" {...register('nickname')} />
                    <div style={errorSpaceStyle(errors.nickname)}>&nbsp;</div>
                  </div>

                  {/* 일반 회원가입 버튼 */}
                  <div className="d-grid mt-4">
                    <CButton 
                      size="lg" 
                      type="submit" 
                      style={buttonStyle}
                      disabled={!isValid || isLoading.basic} // 유효하지 않으면 클릭도 막기
                    >
                      {isLoading.basic ? <CSpinner size="sm" /> : '회원가입'}
                    </CButton>
                  </div>

                  {/* 구분선 섹션 */}
                  <div className="my-4 d-flex align-items-center">
                    <hr className="flex-grow-1" style={{ borderTop: '1px solid #e0e0e0' }} />
                    <span className="px-3 text-muted" style={{ fontSize: '12px' }}>또는 소셜 계정으로 가입</span>
                    <hr className="flex-grow-1" style={{ borderTop: '1px solid #e0e0e0' }} />
                  </div>

                  {/* 구글 회원가입 버튼 */}
                  <div className="d-flex justify-content-center mb-3">
                    <CButton
                      type="button"
                      onClick={onGoogleLogin}
                      className="d-flex align-items-center justify-content-center gap-2"
                      style={{ 
                        border: '1px solid #e0e0e0', 
                        backgroundColor: '#F2F2F2',
                        color: '#3c4043', 
                        fontWeight: '600',
                        fontSize: '14px',
                        padding: '10px 24px',
                        borderRadius: '8px',
                        width: '100%' // 회원가입 페이지에선 시원하게 꽉 채우는 것도 방법입니다.
                      }}
                    >
                      <img 
                        src="https://developers.google.com/static/identity/images/branding_guideline_sample_nt_rd_sl.svg?hl=ko" 
                        alt="Google" 
                        style={{ width: '20px', height: '20px' }} 
                      />
                      구글 계정으로 시작하기
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default RegisterPage;