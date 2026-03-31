/**
 * PostCard Component
 *
 * 커뮤니티 게시글을 카드 형태로 표시하는 컴포넌트.
 * 썸네일 이미지, 카테고리 태그, 제목, 작성자 정보, 좋아요/댓글 수를 표시.
 *
 * @param {Object}  post            - 게시글 데이터 객체
 * @param {string}  post.tag        - 카테고리 태그 ('자유' | '정보' | '인원모집')
 * @param {string}  post.image      - 썸네일 이미지 URL
 * @param {string}  post.title      - 게시글 제목
 * @param {string}  post.author     - 작성자 이름
 * @param {string}  post.date       - 작성 날짜 문자열
 * @param {number}  post.likes      - 좋아요 수
 * @param {number}  post.comments   - 댓글 수
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CCard, CCardBody, CCardImage } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilHeart, cilCommentSquare } from '@coreui/icons'

// 태그별 색상 정의
const TAG_STYLES = {
  자유:     { background: '#f0e6d3', color: '#b07d3a' },
  정보:     { background: '#d3e8df', color: '#2e6b4f' },
  인원모집: { background: '#d9e4f5', color: '#2d4fa0' },
}

const PostCard = ({ post }) => {
  const navigate = useNavigate()
  const { id, tag, image, title, author, date, likes, comments } = post
  const tagStyle = TAG_STYLES[tag] ?? TAG_STYLES['자유']

  return (
    <CCard
    // 클릭 시 해당 
      onClick={() => navigate(`/post/${id}`)}
      style={{
        backgroundColor: '#fff',
        borderRadius: '18px',
        overflow: 'hidden',
        border: 'none',
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        cursor: 'pointer',
        transition: 'transform 0.25s cubic-bezier(.2,.8,.3,1), box-shadow 0.25s',
        height: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.12)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)'
      }}
    >
      {/* 썸네일 영역 */}
      <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
        <CCardImage
          src={image || 'https://picsum.photos/400/180'}
          alt={title}
           onError={(e) => {
              e.target.onerror = null  // ← 이거 추가! 무한루프 차단
              e.target.src = 'https://picsum.photos/400/180' // 빈문자열도 이미지없는것으로 간주하여 플레이스홀더 처리
  }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 0,
            display: 'block',
          }}
        />
        {/* 하단 그라데이션 오버레이 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 60%)',
          }}
        />
        {/* 카테고리 태그 */}
        <span
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 2,
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.04em',
            ...tagStyle,
          }}
        >
          {tag}
        </span>
      </div>

      {/* 카드 본문 */}
      <CCardBody style={{ padding: '16px 16px 12px' }}>
        {/* 제목 (2줄 clamp) */}
        <p
          style={{
            fontSize: '14px',
            fontWeight: 700,
            color: 'var(--cui-body-color)',
            marginBottom: '12px',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {title}
        </p>

        {/* 구분선 */}
        <hr style={{ borderColor: '#f0ede8', margin: '0 0 10px' }} />

        {/* 작성자 + 통계 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* 아바타 + 이름/날짜 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #d4e8db, #6aab81)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700,
                color: '#3d6b4f',
                flexShrink: 0,
              }}
            >
              {author[0]}
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--cui-body-color)' }}>
                {author}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--cui-secondary-color)', marginTop: 1 }}>
                {date}
              </div>
            </div>
          </div>

          {/* 좋아요 / 댓글 */}
          <div style={{ display: 'flex', gap: 10 }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                fontSize: '11px',
                color: 'var(--cui-secondary-color)',
              }}
            >
              <CIcon icon={cilHeart} style={{ width: 13, height: 13 }} />
              {likes}
            </span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                fontSize: '11px',
                color: 'var(--cui-secondary-color)',
              }}
            >
              <CIcon icon={cilCommentSquare} style={{ width: 13, height: 13 }} />
              {comments}
            </span>
          </div>
        </div>
      </CCardBody>
    </CCard>
  )
}

export default PostCard