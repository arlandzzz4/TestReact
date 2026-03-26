/**
 * CommunityPosts Component
 *
 * 커뮤니티 게시글 목록을 반응형 카드 그리드로 표시하는 섹션 컴포넌트.
 * Dashboard.js 안에 삽입해서 사용합니다.
 *
 * 반응형 열 수:
 *   - ~576px  (xs) → 1열
 *   - ~768px  (sm) → 2열
 *   - ~992px  (md) → 2열  ← 필요하면 3으로 변경 가능
 *   - ~1200px (lg) → 3열
 *   - 1200px+ (xl) → 4열
 */

import React, { useState } from 'react'
import {
  CRow,
  CCol,
  CButton,
  CFormInput,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilPlus } from '@coreui/icons'
import PostCard from './PostCard'

// ── 샘플 데이터 (실제 API 연동 시 이 배열을 교체하세요) ──────────────────────
const ALL_POSTS = [
  {
    id: 1,
    tag: '자유',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    title: '새벽 한강 10Km 달성!! 드디어 해냈습니다 🎉',
    author: '홍길동',
    date: '26.03.10 · 16:42',
    likes: 5,
    comments: 3,
  },
  {
    id: 2,
    tag: '자유',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
    title: '데드리프트 3개월 만에 100kg 돌파 후기',
    author: '홍길동',
    date: '26.03.10 · 16:42',
    likes: 12,
    comments: 7,
  },
  {
    id: 3,
    tag: '정보',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
    title: '고단백 저칼로리 식단 레시피 총정리 (벌크업용)',
    author: '김영희',
    date: '26.03.09 · 10:15',
    likes: 24,
    comments: 11,
  },
  {
    id: 4,
    tag: '정보',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&q=80',
    title: '매일 30분 계단 오르기, 3개월 결과 공유합니다',
    author: '이철수',
    date: '26.03.08 · 14:30',
    likes: 9,
    comments: 4,
  },
  {
    id: 5,
    tag: '인원모집',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80',
    title: '강남 크로스핏 같이 하실 분 모집합니다 (주 3회)',
    author: '박민준',
    date: '26.03.07 · 09:00',
    likes: 6,
    comments: 15,
  },
  {
    id: 6,
    tag: '자유',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
    title: '다이어트 6개월 체중 변화 기록 — 20kg 감량 성공',
    author: '최수진',
    date: '26.03.06 · 18:55',
    likes: 41,
    comments: 22,
  },
  {
    id: 7,
    tag: '정보',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80',
    title: '스쿼트 자세 교정 후 무릎 통증이 사라진 이유',
    author: '정재훈',
    date: '26.03.05 · 11:20',
    likes: 18,
    comments: 9,
  },
  {
    id: 8,
    tag: '인원모집',
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80',
    title: '홍대 러닝크루 모집 — 매주 토요일 아침 7시',
    author: '윤소연',
    date: '26.03.04 · 08:00',
    likes: 33,
    comments: 28,
  },
]

const TABS = ['전체', '자유', '정보', '인원모집', '공지사항']

const CommunityPosts = () => {
  const [activeTab, setActiveTab] = useState('전체')
  const [searchQuery, setSearchQuery] = useState('')

  // 탭 + 검색어 필터링
  const filteredPosts = ALL_POSTS.filter((post) => {
    const matchTab = activeTab === '전체' || post.tag === activeTab
    const matchSearch = post.title.includes(searchQuery) || post.author.includes(searchQuery)
    return matchTab && matchSearch
  })

  return (
    <div className="mb-4">

      {/* ── 섹션 헤더 ── */}
      <div
        className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3"
      >
        <h5 className="mb-0 fw-semibold">커뮤니티 게시글</h5>

        {/* 글쓰기 버튼 */}
        <CButton
          size="sm"
          style={{
            background: '#c8a96e',
            border: 'none',
            borderRadius: '40px',
            fontWeight: 700,
            color: '#fff',
            padding: '6px 16px',
          }}
        >
          <CIcon icon={cilPlus} className="me-1" />
          글쓰기
        </CButton>
      </div>

      {/* ── 필터 탭 + 검색 ── */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">

        {/* 필터 탭 */}
        <div
          style={{
            display: 'flex',
            gap: 4,
            background: 'var(--cui-card-bg, #fff)',
            borderRadius: '40px',
            padding: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                border: 'none',
                background: activeTab === tab ? '#3d6b4f' : 'transparent',
                color: activeTab === tab ? '#fff' : 'var(--cui-secondary-color)',
                padding: '6px 16px',
                borderRadius: '36px',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: activeTab === tab ? '0 2px 8px rgba(61,107,79,0.35)' : 'none',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 검색창 */}
        <CInputGroup style={{ width: 220 }}>
          <CFormInput
            placeholder="게시글 검색..."
            size="sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ borderRadius: '40px 0 0 40px', fontSize: '13px' }}
          />
          <CInputGroupText
            style={{
              background: '#3d6b4f',
              border: 'none',
              borderRadius: '0 40px 40px 0',
              cursor: 'pointer',
            }}
          >
            <CIcon icon={cilSearch} style={{ color: '#fff', width: 14, height: 14 }} />
          </CInputGroupText>
        </CInputGroup>

      </div>

      {/* ── 반응형 카드 그리드 ── */}
      {filteredPosts.length > 0 ? (
        <CRow className="g-3">
          {filteredPosts.map((post) => (
            <CCol
              key={post.id}
              xs={12}   // ~576px  → 1열
              sm={6}    // ~768px  → 2열
              md={6}    // ~992px  → 2열
              lg={4}    // ~1200px → 3열
              xl={3}    // 1200px+ → 4열
            >
              <PostCard post={post} />
            </CCol>
          ))}
        </CRow>
      ) : (
        <div
          className="text-center py-5"
          style={{ color: 'var(--cui-secondary-color)', fontSize: '14px' }}
        >
          검색 결과가 없습니다.
        </div>
      )}

    </div>
  )
}

export default CommunityPosts