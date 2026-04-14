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

import React, { useState, useEffect, useRef, useCallback } from 'react'
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
import WritePost from './WritePost'
import { useNavigate } from 'react-router-dom'
import { properties } from '@/constants/properties'

const TABS = ['전체', '자유', '정보', '인원모집', '공지사항']

const TAB_COLORS = {
  '전체':    { bg: '#3d6b4f', color: '#fff',     shadow: 'rgba(61,107,79,0.35)' },
  '자유':    { bg: '#F0E6D3', color: '#B07D3A',  shadow: 'rgba(176,125,58,0.35)' },
  '정보':    { bg: '#D3E8DF', color: '#2E6B4F',  shadow: 'rgba(46,107,79,0.35)' },
  '인원모집': { bg: '#D9E4F5', color: '#2D4FA0', shadow: 'rgba(45,79,160,0.35)' },
  '공지사항': { bg: '#F7E6EA', color: '#A63A50', shadow: 'rgba(166,58,80,0.35)' },
}

const CommunityPosts = () => {
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState('전체')
  const [searchQuery, setSearchQuery] = useState('')
  const [submittedKeyword, setSubmittedKeyword] = useState('') // 실제 API 요청에 쓰일 확정된 검색어

    const [lastId, setLastId] = useState(0)          // 마지막으로 불러온 게시글 ID (백엔드 기본값 0)
  const [hasMore, setHasMore] = useState(true)     // 더 불러올 게시글이 있는지
  const [loading, setLoading] = useState(false)    // 로딩 중 여부
  const observerRef = useRef(null)                 // IntersectionObserver 타겟
    const loadingRef = useRef(false)                 // loading을 ref로도 관리
  const hasMoreRef = useRef(true)                  // hasMore를 ref로도 관리
  const lastIdRef = useRef(0)                      // lastId를 ref로도 관리

  const navigate = useNavigate()
  const LIMIT = 10
  const IMAGE_URL = properties.getImageUrl() || ''

  //API 호출
  const fetchPosts = useCallback(async (isReset = false) => {
    // isReset이 아닐 때만 기존 로딩/hasMore 방어 로직을 탐
    if (!isReset && (loadingRef.current || !hasMoreRef.current)) return
    loadingRef.current = true
    setLoading(true)

    try {
      // 카테고리 이름에 맞는 코드값 설정
      const categoryCode = activeTab === '전체' ? '' :
        activeTab === '자유' ? '01' :
        activeTab === '정보' ? '02' :
        activeTab === '인원모집' ? '03' : '04';
        
      // 리셋 모드(검색/탭변경)일 경우 lastId를 0으로 보냄
      const currentLastId = isReset ? 0 : lastIdRef.current;

      const res = await instance.get('/api/post/search/post', {
        params: { 
          lastId: currentLastId, 
          size: LIMIT,                                // limit -> size 로 변경
          word: submittedKeyword || '',               // keyword -> word 로 변경
          categoryCode: categoryCode || '' 
        }
      })
      const newPosts = res.data

      setPosts(prev => isReset ? newPosts : [...prev, ...newPosts])

      if (newPosts.length < LIMIT) {
        hasMoreRef.current = false
        setHasMore(false) // 더 이상 불러올 게시글 없음
      } else {
        const newLastId = newPosts[newPosts.length - 1].postId
        lastIdRef.current = newLastId
        setLastId(newLastId) // 마지막 게시글 ID 저장
      }
    } catch (err) {
      console.error(err)
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }, [activeTab, submittedKeyword])

  // 탭이 바뀌거나 검색어가 제출되면 목록을 완전히 초기화하고 처음부터 다시 불러옵니다.
  useEffect(() => {
    lastIdRef.current = 0;
    setLastId(0);
    hasMoreRef.current = true;
    setHasMore(true);
    fetchPosts(true); // isReset = true
  }, [activeTab, submittedKeyword, fetchPosts])

  // IntersectionObserver - 스크롤 감지
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchPosts()
      }
    }, { threshold: 1.0 })

    if (observerRef.current) observer.observe(observerRef.current)

    return () => observer.disconnect()
  }, [fetchPosts])

  //카테고리 변환 함수
  const getCategoryName = (id) => {
    switch (id) {
      case '01': return '자유'
      case '02': return '정보'
      case '03': return '인원모집'
      case '04': return '공지사항'
      default: return '자유' // 알 수 없는 코드이거나 값이 없을 경우 '자유'로 기본값 설정
    }
  }

  // 검색 실행 핸들러
  const handleSearch = () => {
    setSubmittedKeyword(searchQuery);
  };

  //날짜 포멧
  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return `${d.getFullYear().toString().slice(2)}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getDate().toString().padStart(2, '0')}`
  }

  // 백앤드 데이터 프론트에서 필요한 데이터로 변환
const mappedPosts = posts.map(post => ({
    id: post.postId,
    tag: getCategoryName(post.categoryCode),
    title: post.title,
    author: post.nickname,
    date: formatDate(post.createdAt),
    likes: post.likes,
    comments: post.comments,
    image: post.thumbnail 
  ? post.thumbnail.startsWith('http') ? post.thumbnail : `${(IMAGE_URL || '').replace(/\/$/, '')}${post.thumbnail}`
  : null
  }))

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
                background: activeTab === tab ? TAB_COLORS[tab].bg : 'transparent',
                color: activeTab === tab ? TAB_COLORS[tab].color : 'var(--cui-secondary-color)',
                padding: '6px 16px',
                borderRadius: '36px',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: activeTab === tab ? `0 2px 8px ${TAB_COLORS[tab].shadow}` : 'none',
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
            }}
            style={{ borderRadius: '40px 0 0 40px', fontSize: '13px' }}
          />
          <CInputGroupText
            onClick={handleSearch}
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
            onClick={() => navigate('/write')}
          // 새 창에 여는 코드는 밑에.
          // onClick={() => window.open('/write', '_blank', 'noopener,noreferrer')}
          >
            <CIcon icon={cilPlus} className="me-1" />
            글쓰기
          </CButton>

        </div>

      </div>

      {/* ── 반응형 카드 그리드 ── */}
      {mappedPosts.length > 0 ? (
        <CRow className="g-3">
          {mappedPosts.map((post) => (
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

       {/* ── 무한 스크롤 감지 타겟 ── */}
      <div ref={observerRef} style={{ height: 1 }} />

      {/* ── 로딩 표시 ── */}
      {loading && (
        <div className="text-center py-3" style={{ color: 'var(--cui-secondary-color)', fontSize: '14px' }}>
          불러오는 중...
        </div>
      )}

      {/* ── 더 이상 게시글 없음 ── */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-3" style={{ color: 'var(--cui-secondary-color)', fontSize: '14px' }}>
          모든 게시글을 불러왔습니다.
        </div>
      )}

    </div>
  )
}

export default CommunityPosts