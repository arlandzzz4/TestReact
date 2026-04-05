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
        deletedId: user.email,
        delYn: 'Y',
      };
      console.log("삭제할 게시글 데이터:", deleteData);
    setConfirmModalOnConfirm(() => () => {
      deletePostMutation.mutate(deleteData, {
        onSuccess: () => {          refetchPosts();
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
/*
  const confirmModalOnConfirm = (data) => {
    if (activeKey === 1) {
      deletePostMutation.mutate(data, {
        onSuccess: () => {
          refetchPosts();
          setIsModalOpen(false);
        },
        onError: (error) => {
          console.error('게시글 삭제 실패:', error);
          setIsModalOpen(false);
        },
      });
    }
    else if (activeKey === 2) {
      deleteCommentMutation.mutate(data, {
        onSuccess: () => {
          refetchComments();
          setIsModalOpen(false);
        },
        onError: (error) => {
          console.error('댓글 삭제 실패:', error);
          setIsModalOpen(false);
        },
      });
    }

  }*/

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