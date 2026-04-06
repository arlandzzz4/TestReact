import React, { useState } from 'react'
import { CNav, CNavItem, CNavLink, CTabContent } from '@coreui/react'
import PostDelete from './PostDelete'
import CommentDelete from './CommentDelete'
import { usePostList, usePostTotalCountQuery } from '@/hooks/queries/usePostQuery';
import { useCommentList, useCommentTotalCountQuery } from '../../../hooks/queries/useCommentQuery';

const DeleteBoard = () => {
  const [size] = useState(10)
  const [activeKey, setActiveKey] = useState(1)

    const [postParams, setPostParams] = useState({ size, offset: 0, targetCode: '01', delYn: 'Y' })
  const { data: postDeletesData, isLoading: isPostLoading, refetch: refetchPosts } = usePostList(postParams)
  const { data: postTotalCnt = 0 } = usePostTotalCountQuery({ categoryCode: '', delYn: 'Y' })

  const [commentParams, setCommentParams] = useState({ size, offset: 0, targetCode: '02', delYn: 'Y' })
  const { data: commentDeletesData, isLoading: isCommentLoading, refetch: refetchComments } = useCommentList(commentParams)
  const { data: commentTotalCnt = 0 } = useCommentTotalCountQuery({ delYn: 'Y' })

  const postTotalPages = Math.ceil(postTotalCnt / size) || 1
  const postCurrentPage = Math.floor(postParams.offset / size) + 1
  const handlePostPageChange = (pageNumber) => {
    const newOffset = (pageNumber - 1) * size
    setPostParams((prev) => ({ ...prev, offset: newOffset }))
  }

  const commentTotalPages = Math.ceil(commentTotalCnt / size) || 1
  const commentCurrentPage = Math.floor(commentParams.offset / size) + 1
  const handleCommentPageChange = (pageNumber) => {
    const newOffset = (pageNumber - 1) * size
    setCommentParams((prev) => ({ ...prev, offset: newOffset }))
  }

return (
    <div className="report-container mt-2 p-3" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <CNav variant="tabs" className="border-0 mb-0">
        <CNavItem>
          <CNavLink
            active={activeKey === 1}
            onClick={(e) => {
                e.preventDefault();
                setActiveKey(1);
            }}
            className={`py-2 px-4 border-0 rounded-top ${
              activeKey === 1 ? 'text-success fw-bold' : 'text-secondary'
            }`}
            style={{ 
              backgroundColor: activeKey === 1 ? 'white' : 'transparent',
              borderBottom: activeKey === 1 ? '3px solid #198754 !important' : 'none'
            }}
          >
            게시글 삭제 ({postTotalCnt})
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            active={activeKey === 2}
            onClick={(e) => {
                e.preventDefault();
                setActiveKey(2);
            }}
            className={`py-2 px-4 border-0 rounded-top ${
              activeKey === 2 ? 'text-success fw-bold' : 'text-secondary'
            }`}
            style={{ 
              backgroundColor: activeKey === 2 ? 'white' : 'transparent',
              borderBottom: activeKey === 2 ? '3px solid #198754 !important' : 'none'
            }}
          >
            댓글 삭제 ({commentTotalCnt})
          </CNavLink>
        </CNavItem>
      </CNav>

      <div 
        className="bg-white p-4 shadow-sm" 
        style={{ 
          borderRadius: '0 15px 15px 15px',
          border: '1px solid #ffffff'
        }}
      >
        <CTabContent>
          {activeKey === 1 && (
          <PostDelete
            postDeletes={postDeletesData} 
            isLoading={isPostLoading}
            onPageChange={handlePostPageChange}
            postTotalPages={postTotalPages}
            postCurrentPage={postCurrentPage}
          />
          )}
          
          {activeKey === 2 && (
          <CommentDelete
            commentDeletes={commentDeletesData} 
            isLoading={isCommentLoading}
            onPageChange={handleCommentPageChange}
            commentTotalPages={commentTotalPages}
            commentCurrentPage={commentCurrentPage}
          />
          )}
        </CTabContent>
      </div>
    </div>
  )
}

export default DeleteBoard