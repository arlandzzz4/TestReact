/**
 * DashUserCard Component
 *
 * 관리자 대시보드의 전체회원 카운팅.
 *
 */

import React from 'react'
import { CCard, CCardBody, CCardImage } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilHeart, cilCommentSquare } from '@coreui/icons'
import { useUserTotalCountQuery, useUserTodayCountQuery } from '@/hooks/queries/useUserQuery';

const DashUserCard = () => {
    //API 호출
    useEffect(() => {
        /*
        const fetchPosts = async () => {
            try {
                setPosts(res.data)
            } catch (err) {
                console.error(err)
            }
        }
        fetchPosts()
        */
    }, [])
    

    return (
    <CCard
      style={{
        borderRadius: '18px',
        overflow: 'hidden',
        border: 'none',
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        cursor: 'pointer',
        transition: 'transform 0.25s cubic-bezier(.2,.8,.3,1), box-shadow 0.25s',
        height: '100%',
      }}
    >
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

export default DashUserCard