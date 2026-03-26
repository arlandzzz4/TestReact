// src/views/community/PostCard.jsx
import { CCard, CCardImage, CCardBody, CBadge } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilHeart, cilCommentSquare } from '@coreui/icons'

const TAG_STYLE = {
  자유:     { bg: '#f0e6d3', color: '#b07d3a' },
  정보:     { bg: '#d3e8df', color: '#2e6b4f' },
  인원모집: { bg: '#d9e4f5', color: '#2d4fa0' },
}

export default function PostCard({ post }) {
  const { tag, image, title, author, date, likes, comments } = post
  const tagStyle = TAG_STYLE[tag] ?? TAG_STYLE['자유']

  return (
    <CCard className="post-card h-100">

      {/* 썸네일 */}
      <div className="card-thumb">
        <CCardImage
          orientation="top"
          src={image}
          alt={title}
          className="card-thumb-img"
        />
        {/* 태그 뱃지 */}
        <span
          className="card-tag"
          style={{ background: tagStyle.bg, color: tagStyle.color }}
        >
          {tag}
        </span>
      </div>

      {/* 본문 */}
      <CCardBody className="card-body-inner">
        <p className="card-title-text">{title}</p>
        <hr className="card-divider" />
        <div className="card-meta">
          {/* 작성자 */}
          <div className="card-author">
            <div className="author-avatar">{author[0]}</div>
            <div>
              <div className="author-name">{author}</div>
              <div className="author-date">{date}</div>
            </div>
          </div>
          {/* 좋아요 / 댓글 */}
          <div className="card-stats">
            <span className="stat-item">
              <CIcon icon={cilHeart} size="sm" /> {likes}
            </span>
            <span className="stat-item">
              <CIcon icon={cilCommentSquare} size="sm" /> {comments}
            </span>
          </div>
        </div>
      </CCardBody>

    </CCard>
  )
}