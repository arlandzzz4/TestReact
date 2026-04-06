import React, { useState } from 'react'
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react'
import PostReport from './PostReport'
import CommentReport from './CommentReport'
import { useReportTotalCountQuery, useReportList } from '@/hooks/queries/useReportQuery'
import { useDeletePostMutation } from '@/hooks/mutations/usePostMutation'
import { useDeleteCommentMutation } from '@/hooks/mutations/useCommentMutation' 
import { useAuth } from '../../../hooks/useAuth'
import CommonConfirmModal from '../common/CommonConfirmModal'

const ReportBoard = () => {
  const [size] = useState(10)
  const [activeKey, setActiveKey] = useState(1)
  const deletePostMutation = useDeletePostMutation()
  const deleteCommentMutation = useDeleteCommentMutation()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const [confirmModalTitle, setConfirmModalTitle] = useState('신고된 게시글을 삭제하시겠습니까?');
  const [confirmModalContent, setConfirmModalContent] = useState('');
  const [confirmModalGuide, setConfirmModalGuide] = useState('삭제 후 삭제 관리 페이지에 저장됩니다.');
  const [confirmModalWriter, setConfirmModalWriter] = useState('');
  const [confirmModalOnConfirm , setConfirmModalOnConfirm] = useState(() => () => {});

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
    setIsModalOpen(true);
    setConfirmModalTitle('신고된 게시글을 삭제하시겠습니까?');
    setConfirmModalContent(report.content.length > 100 ? report.content.slice(0, 100) + '...' : report.content);
    setConfirmModalWriter(report.targetNickname);
    const deleteData = {
        postId: report.targetId,
        reportId: report.reportId,
        deletedId: user.email,
        delYn: 'Y',
      };
    setConfirmModalOnConfirm(() => () => {
      deletePostMutation.mutate(deleteData, {
        onSuccess: () => {          
          refetchPosts();
          setIsModalOpen(false);
        },
        onError: (error) => {
          console.error('게시글 삭제 실패:', error);
          setIsModalOpen(false);
        },
      });
    });
  }

  const handleCommentDeleteClick = (report) => {
    setIsModalOpen(true);
    setConfirmModalTitle('신고된 댓글을 삭제하시겠습니까?');
    setConfirmModalContent(report.content.length > 100 ? report.content.slice(0, 100) + '...' : report.content);
    setConfirmModalWriter(report.targetNickname);
    const deleteData = {
        commentId: report.targetId,
        reportId: report.reportId,
        delYn: 'Y',
      };
    setConfirmModalOnConfirm(() => () => {
      deleteCommentMutation.mutate(deleteData, {
        onSuccess: () => {          
          refetchComments();
          setIsModalOpen(false);
        },
        onError: (error) => {
          console.error('댓글 삭제 실패:', error);
          setIsModalOpen(false);
        },
      });
    });
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
            className={`py-2 px-4 border-0 rounded-top ${
              activeKey === 2 ? 'text-success fw-bold' : 'text-secondary'
            }`}
            style={{ 
              backgroundColor: activeKey === 2 ? 'white' : 'transparent',
              borderBottom: activeKey === 2 ? '3px solid #198754 !important' : 'none'
            }}
          >
            댓글 신고 ({commentTotalCnt})
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

      <CommonConfirmModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={confirmModalTitle}
        targetContent={confirmModalContent}
        guide={confirmModalGuide}
        writer={confirmModalWriter}
        onConfirm={confirmModalOnConfirm}
      />
    </div>
  )
}

export default ReportBoard