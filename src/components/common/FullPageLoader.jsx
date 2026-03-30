import React from 'react';
import { CSpinner } from '@coreui/react';

/**
 * FullPageLoader Component
 * 앱 초기 로딩이나 전체 화면 로딩이 필요할 때 사용합니다.
 * * @param {string} message - 표시할 로딩 메시지 (기본값: IOB 서비스 구성 중)
 */
const FullPageLoader = ({ message = "IOB 서비스 구성 중" }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
      {/* 1. 스피너 영역: transform scale을 통해 시각적 강조 */}
      <div className="mb-4" style={{ transform: 'scale(1.5)' }}>
        <div className="spinner-grow text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>

      {/* 2. 메시지 영역 */}
      <div className="text-center">
        <h4 className="fw-bold text-dark mb-2" style={{ letterSpacing: '-0.02em' }}>
          {message}
        </h4>
        <p className="text-medium-emphasis animate__animated animate__fadeIn animate__infinite">
          잠시만 기다려 주세요...
        </p>
      </div>

      {/* 3. 로딩 바 애니메이션 */}
      <div style={{ 
        width: '200px', 
        height: '4px', 
        background: '#e0e0e0', 
        borderRadius: '10px', 
        overflow: 'hidden', 
        marginTop: '20px' 
      }}>
        <div 
          className="bg-success" 
          style={{ 
            width: '100%', 
            height: '100%', 
            animation: 'loading-bar 2s infinite ease-in-out' 
          }} 
        />
      </div>

      {/* 로컬 스타일 정의 (별도 CSS 파일 없이 컴포넌트 독립성 유지) */}
      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default React.memo(FullPageLoader);