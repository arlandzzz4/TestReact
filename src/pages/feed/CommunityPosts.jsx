/**
 * CommunityPosts Component
 *
 * 커뮤니티 게시글 목록을 반응형 카드 그리드로 표시하는 섹션 컴포넌트.
 * Feed.jsx 안에 삽입해서 사용합니다.
 *
 * 반응형 열 수:
 *   - ~576px  (xs) → 1열
 *   - ~768px  (sm) → 2열
 *   - ~992px  (md) → 2열  ← 필요하면 3으로 변경 가능
 *   - ~1200px (lg) → 3열
 *   - 1200px+ (xl) → 4열
 */

import React, { useState, useEffect } from 'react'
import { instance } from '@/api/axios' // 하드코딩 대신 설정된 axios 인스턴스 사용
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

const TABS = ['전체', '자유', '정보', '인원모집', '공지사항']

const CommunityPosts = () => {
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState('전체')
  const [searchQuery, setSearchQuery] = useState('')

  //API 호출
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await instance.get('/api/post/search/post', {
          params: { limit: 10 }
        })
        setPosts(res.data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchPosts()
  }, [])

  //카테고리 변환 함수
  const getCategoryName = (id) => {
    switch (id) {
      case 1: return '자유'
      case 2: return '정보'
      case 3: return '인원모집'
      default: return '공지사항'
    }
  }

  //날짜 포멧
  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return `${d.getFullYear().toString().slice(2)}.${(d.getMonth()+1).toString().padStart(2,'0')}.${d.getDate().toString().padStart(2,'0')}`
  }

  // 백앤드 데이터 프론트에서 필요한 데이터로 변환
  const mappedPosts = posts.map(post => ({
    id: post.postId,
    tag: getCategoryName(post.categoryId),
    title: post.title,
    author: post.nickname,
    date: formatDate(post.createdAt),
    likes: post.likes,
    comments: post.comments,
  }))

  // 탭 + 검색어 필터링
  const filteredPosts = mappedPosts.filter((post) => {
    const matchTab = activeTab === '전체' || post.tag === activeTab
    const matchSearch =
      post.title.includes(searchQuery) ||
      post.author.includes(searchQuery)
    return matchTab && matchSearch
  })

  return (
    <div className="mb-4">

      {/* ── 섹션 헤더 ── */}
      <div
        className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3"
      >
        {/* <h5 className="mb-0 fw-semibold">커뮤니티 게시글</h5> */}


      </div>

      {/* ── 필터 탭 + 검색 + 글쓰기 버튼 */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">

        {/* 필터 탭 */}
        <div
          style={{
            display: 'flex',
            gap: 4,
            background: '#fff',
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

        {/* 우측 그룹: 검색창 + 글쓰기 버튼 */}
        <div className="d-flex align-items-center gap-2">
          
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

      </div>

      {/* ── 반응형 카드 그리드 ── */}
      {filteredPosts.length > 0 ? (
        <CRow className="g-3">
          {filteredPosts.map((post) => (
            <CCol
              key={post.id}
              xs={12}
              sm={6}
              md={6}
              lg={4}
              xl={3}
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