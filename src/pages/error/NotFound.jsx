import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'sans-serif',
      backgroundColor: '#f7f5f0',
      padding: '2rem',
      animation: 'fadeIn 0.5s ease both',
    }}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .logo-float { animation: float 3.5s ease-in-out infinite; }
        .home-btn:hover { background: #2e5530 !important; transform: scale(1.02); }
        .home-btn:active { transform: scale(0.98); }
      `}</style>

      {/* 로고
      <div className="logo-float" style={{ marginBottom: '2rem' }}>
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
          <rect width="72" height="72" rx="16" fill="#f0f4ec"/>
          <text x="10" y="52" fontSize="32" fontWeight="700" fill="#3a6b3a" fontFamily="serif">IoB</text>
          <ellipse cx="36" cy="22" rx="9" ry="6" fill="#5a9e3a" opacity="0.85"/>
          <ellipse cx="27" cy="25" rx="7" ry="5" fill="#7abf54" opacity="0.7" transform="rotate(-20 27 25)"/>
          <ellipse cx="45" cy="25" rx="7" ry="5" fill="#7abf54" opacity="0.7" transform="rotate(20 45 25)"/>
          <line x1="36" y1="28" x2="36" y2="36" stroke="#5a9e3a" strokeWidth="2"/>
        </svg>
      </div> */}

      {/* 404 숫자 */}
      <h1 style={{ fontSize: '88px', fontWeight: '500', color: '#3a6b3a', lineHeight: 1, margin: 0 }}>
        404
      </h1>

      {/* 구분선 */}
      <div style={{ width: '40px', height: '2px', background: '#b8d4a8', borderRadius: '2px', margin: '1.5rem 0' }} />

      <h2 style={{ fontSize: '20px', fontWeight: '500', margin: '0 0 0.5rem' }}>
        페이지를 찾을 수 없어요
      </h2>
      <p style={{ fontSize: '14px', color: '#888', textAlign: 'center', lineHeight: 1.6, margin: '0 0 2.5rem' }}>
        요청하신 페이지가 이동되었거나 삭제되었을 수 있습니다.<br/>
        주소를 다시 확인하거나 홈으로 돌아가 주세요.
      </p>

      {/* 홈 버튼 */}
      <Link
        to="/"
        className="home-btn"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: '#3a6b3a', color: '#fff', borderRadius: '8px',
          padding: '12px 28px', fontSize: '15px', fontWeight: '500',
          textDecoration: 'none', transition: 'background 0.18s, transform 0.12s',
        }}
      >
        🏠 홈으로 돌아가기
      </Link>

      {/* 브레드크럼 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#aaa', marginTop: '1.5rem' }}>
        <span style={{ color: '#3a6b3a' }}>홈</span>
        <span>›</span>
        <span>404 오류</span>
      </div>
    </div>
  );
};

export default NotFound;