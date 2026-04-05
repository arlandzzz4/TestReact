import React, { useState } from 'react'
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react'
import PostReport from './PostReport'
import CommentReport from './CommentReport'
import { useReportTotalCountQuery, useReportList } from '@/hooks/queries/useReportQuery'
import { useDeletePostMutation } from '@/hooks/mutations/usePostMutation'
import { useDeleteCommentMutation } from '@/hooks/mutations/useCommentMutation' 
import { useAuth } from '../../../hooks/useAuth'

const ReportBoard = () => {
  const [size] = useState(10)
  const [activeKey, setActiveKey] = useState(1)
  const deletePostMutation = useDeletePostMutation()
  const deleteCommentMutation = useDeleteCommentMutation()
  const { user } = useAuth();

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
    console.log('삭제 ID:', user)
    if (window.confirm('해당 게시글 신고를 삭제하시겠습니까?')) {
      deletePostMutation.mutate(
        { postId: report.postId,
          deletedId: user ? user.email : null,
          delYn : 'Y'
         }, 
        { onSuccess: () => refetchPosts(),
          onError: (error) => {
            console.error('게시글 삭제 에러:', error);
            alert('게시글 삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          }
         }
      );
    }
  }

  const handleCommentDeleteClick = (report) => {
    if (window.confirm('해당 댓글 신고를 삭제하시겠습니까?')) {
      console.log('삭제 ID:', report.id)
      deleteCommentMutation.mutate(
        { id: report.commentId,
          delYn : 'Y'
         },
        { onSuccess: () => refetchComments(),
          onError: (error) => {
            console.error('댓글 삭제 에러:', error);
            alert('댓글 삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          }
        }
      );
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