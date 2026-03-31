import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CFormCheck,
  CButton,
  CContainer,
  CRow,
  CCol,
} from '@coreui/react';

const Agreement = () => {
  const navigate = useNavigate();
  // 1. 각 약관의 동의 상태 관리
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
  });

  // 2. 전체 동의 여부 확인 (버튼 활성화 조건)
  const isAllAgreed = agreements.terms && agreements.privacy;

  const handleCheck = (e) => {
    const { id, checked } = e.target;
    setAgreements((prev) => ({ ...prev, [id]: checked }));
  };

  return (
    <CContainer className="py-5" style={{ backgroundColor: '#FBF9F6', minHeight: '100vh' }}>
      <CRow className="justify-content-center">
        <CCol md={8} lg={6}>
          {/* 메인 제목 */}
          <h2 className="text-center mb-5" style={{ color: '#1A4332', fontWeight: '700' }}>
            이용 약관
          </h2>

          {/* [필수] 이용약관 동의 섹션 */}
          <div className="mb-4">
            <label className="fw-bold mb-2" style={{ color: '#4A4A4A' }}>
              [필수] 이용약관 동의
            </label>
            <CCard className="shadow-sm border-0 mb-2" style={{ borderRadius: '12px' }}>
              <CCardBody 
                style={{ 
                  height: '150px', 
                  overflowY: 'scroll', 
                  fontSize: '14px', 
                  lineHeight: '1.6',
                  color: '#666' 
                }}
              >
                본 약관은 서비스 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정합니다...
                <br />• 회원은 본 약관에 동의함으로써 서비스를 이용할 수 있습니다.
                <br />• 회사는 서비스 제공과 관련하여 필요한 경우 약관을 변경할 수 있습니다.
              </CCardBody>
            </CCard>
            <CFormCheck
              id="terms"
              label="동의합니다"
              checked={agreements.terms}
              onChange={handleCheck}
              style={{ color: '#2D6A4F', cursor: 'pointer' }}
            />
          </div>

          {/* [필수] 개인정보 수집 및 이용 동의 섹션 */}
          <div className="mb-5">
            <label className="fw-bold mb-2" style={{ color: '#4A4A4A' }}>
              [필수] 개인정보 수집 및 이용 동의
            </label>
            <CCard className="shadow-sm border-0 mb-2" style={{ borderRadius: '12px' }}>
              <CCardBody 
                style={{ 
                  height: '150px', 
                  overflowY: 'scroll', 
                  fontSize: '14px', 
                  lineHeight: '1.6',
                  color: '#666' 
                }}
              >
                회사는 회원가입 및 서비스 제공을 위해 아래와 같이 개인정보를 수집 및 이용합니다.
                <br />• 수집 항목: 이름, 이메일 주소, 비밀번호
                <br />• 수집 목적: 회원 식별, 서비스 제공, 고객 문의 대응
                <br />• 보유 및 이용 기간: 회원 탈퇴 시까지
              </CCardBody>
            </CCard>
            <CFormCheck
              id="privacy"
              label="동의합니다"
              checked={agreements.privacy}
              onChange={handleCheck}
              style={{ color: '#2D6A4F', cursor: 'pointer' }}
            />
          </div>

          {/* 회원가입 버튼 */}
          <div className="d-grid gap-2">
            <CButton
              size="lg"
              disabled={!isAllAgreed}
              style={{
                backgroundColor: isAllAgreed ? '#2D6A4F' : '#D1D5DB',
                borderColor: isAllAgreed ? '#2D6A4F' : '#D1D5DB',
                color: '#FFFFFF',
                borderRadius: '12px',
                padding: '12px',
                fontWeight: '700',
                transition: 'all 0.3s'
              }}
              onClick={() => navigate('/Register', { 
                                                    replace: true,
                                                    state: {
                                                        terms : agreements.terms ? "Y" : "N",
                                                        privacy : agreements.privacy ? "Y" : "N",
                                                    }
                                                })}
            >
              회원가입
            </CButton>
          </div>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Agreement;