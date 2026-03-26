// src/views/community/CommunityPage.jsx
import { CRow, CCol, CButton, CFormInput, CInputGroup } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilPlus } from '@coreui/icons'
import PostCard from './PostCard'
import './community.scss'

const POSTS = [
  {
    id: 1, tag: '자유',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    title: '새벽 한강 10Km 달성!! 드디어 해냈습니다 🎉',
    author: '홍길동', date: '26.03.10 · 16:42', likes: 5, comments: 3,
  },
  {
    id: 2, tag: '자유',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
    title: '데드리프트 3개월 만에 100kg 돌파 후기',
    author: '홍길동', date: '26.03.10 · 16:42', likes: 5, comments: 3,
  },
  {
    id: 3, tag: '정보',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
    title: '고단백 저칼로리 식단 레시피 총정리 (벌크업용)',
    author: '홍길동', date: '26.03.10 · 16:42', likes: 5, comments: 3,
  },
  {
    id: 4, tag: '정보',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&q=80',
    title: '매일 30분 계단 오르기, 3개월 결과 공유합니다',
    author: '홍길동', date: '26.03.10 · 16:42', likes: 5, comments: 3,
  },
  {
    id: 5, tag: '인원모집',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80',
    title: '강남 크로스핏 같이 하실 분 모집합니다 (주 3회)',
    author: '홍길동', date: '26.03.10 · 16:42', likes: 5, comments: 3,
  },
  {
    id: 6, tag: '자유',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
    title: '다이어트 6개월 체중 변화 기록 — 20kg 감량 성공',
    author: '홍길동', date: '26.03.10 · 16:42', likes: 5, comments: 3,
  },
]

export default function CommunityPage() {
  return (
    <div className="community-page">

      {/* 툴바 */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div className="filter-tabs">
          {['전체', '자유', '정보', '인원모집'].map((tab) => (
            <button key={tab} className="filter-tab">{tab}</button>
          ))}
        </div>
        <div className="d-flex gap-2 align-items-center">
          <CInputGroup style={{ width: 240 }}>
            <CFormInput placeholder="게시글 검색..." />
            <CButton color="success" variant="outline">
              <CIcon icon={cilSearch} />
            </CButton>
          </CInputGroup>
          <CButton color="warning" className="text-white fw-bold">
            <CIcon icon={cilPlus} className="me-1" /> 글쓰기
          </CButton>
        </div>
      </div>

      {/* ✅ 반응형 카드 그리드 */}
      <CRow className="g-3">
        {POSTS.map((post) => (
          <CCol
            key={post.id}
            xs={12}    // ~576px  → 1열
            sm={6}     // ~768px  → 2열
            md={6}     // ~992px  → 2열
            lg={4}     // ~1200px → 3열
            xl={3}     // 1200px+ → 4열
          >
            <PostCard post={post} />
          </CCol>
        ))}
      </CRow>

    </div>
  )
}