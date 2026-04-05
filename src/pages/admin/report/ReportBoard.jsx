import React, { useState } from 'react'
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react'
import PostReport from './PostReport'
import CommentReport from './CommentReport'
import { useReportTotalCountQuery, useReportList } from '@/hooks/queries/useReportQuery'

const ReportBoard = () => {
  const [size] = useState(10)
  const [activeKey, setActiveKey] = useState(1)

  const [postParams, setPostParams] = useState({ size, offset: 0, targetCode: '01' })
  const { data: postReportsData, isLoading: isPostLoading, refetch: refetchPosts } = useReportList(postParams)
  const { data: postTotalCnt = 0 } = useReportTotalCountQuery({ targetCode: '01' })

  const [commentParams, setCommentParams] = useState({ size, offset: 0, targetCode: '02' })
  const { data: commentReportsData, isLoading: isCommentLoading, refetch: refetchComments } = useReportList(commentParams)
  const { data: commentTotalCnt = 0 } = useReportTotalCountQuery({ targetCode: '02' })

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

  const handlePostDeleteClick = (report) => {
    if (window.confirm('해당 게시글 신고를 삭제하시겠습니까?')) {
      console.log('삭제 ID:', report.id)
      // deleteMutation.mutate(report.id, { onSuccess: () => refetchPosts() });
    }
  }

  const handleCommentDeleteClick = (report) => {
    if (window.confirm('해당 댓글 신고를 삭제하시겠습니까?')) {
      console.log('삭제 ID:', report.id)
      // deleteMutation.mutate(report.id, { onSuccess: () => refetchComments() });
    }
  }

  return (
    <div className="report-container mt-2">
      <CNav variant="tabs" className="border-0 mb-3">
        <CNavItem>
          <CNavLink
            active={activeKey === 1}
            onClick={(e) => {
                e.preventDefault();
                setActiveKey(1);
            }}
            className={`py-2 px-4 border-0 ${
              activeKey === 1 ? 'border-bottom border-success border-3 text-dark fw-bold' : 'text-secondary'
            }`}
            style={{ backgroundColor: 'transparent' }}
          >
            게시글 신고 ({postTotalCnt})
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            active={activeKey === 2}
            onClick={(e) => {
                e.preventDefault();
                setActiveKey(2);
            }}
            className={`py-2 px-4 border-0 ${
              activeKey === 2 ? 'border-bottom border-success border-3 text-dark fw-bold' : 'text-secondary'
            }`}
            style={{ backgroundColor: 'transparent' }}
          >
            댓글 신고 ({commentTotalCnt})
          </CNavLink>
        </CNavItem>
      </CNav>

      <CTabContent>
        {activeKey === 1 && (
        <PostReport
          activeKey={activeKey}
          postReports={postReportsData} 
          isLoading={isPostLoading}
          onPageChange={handlePostPageChange}
          postTotalPages={postTotalPages}
          postCurrentPage={postCurrentPage}
          onDeleteClick={handlePostDeleteClick}
        />
        )}
        
        {activeKey === 2 && (
        <CommentReport
          activeKey={activeKey}
          commentReports={commentReportsData} 
          isLoading={isCommentLoading}
          onPageChange={handleCommentPageChange}
          commentTotalPages={commentTotalPages}
          commentCurrentPage={commentCurrentPage}
          onDeleteClick={handleCommentDeleteClick}
        />
        )}
      </CTabContent>
    </div>
  )
}

export default ReportBoard