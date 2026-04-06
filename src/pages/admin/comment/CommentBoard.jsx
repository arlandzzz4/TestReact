import React, {useState} from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormInput,
  CButton,
  CButtonGroup,
} from '@coreui/react'
import { useCodeGroupSearch } from '@/hooks/queries/useCommonQuery';
import StatusBadge from '../common/StatusBadge';
import CommonPagination from '../common/CommonPagination';
import { useCommentList, useCommentTotalCountQuery } from '@/hooks/queries/useCommentQuery';
import CommonConfirmModal from '../common/CommonConfirmModal'
import { useDeleteCommentMutation } from '@/hooks/mutations/useCommentMutation'

const CommentBoard = () => {
    const [size, setSize] = useState(10);
    const [offset, setOffset] = useState(0);
    const [searchInput, setSearchInput] = useState(''); 
    const [searchWord, setSearchWord] = useState('');
    const deleteCommentMutation = useDeleteCommentMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [confirmModalTitle, setConfirmModalTitle] = useState('댓글을 삭제하시겠습니까?');
    const [confirmModalContent, setConfirmModalContent] = useState('');
    const [confirmModalGuide, setConfirmModalGuide] = useState('삭제된 댓글은 복구할 수 없습니다.\n해당 게시글의 댓글도 함께 삭제됩니다.');
    const [confirmModalWriter, setConfirmModalWriter] = useState('');
    const [confirmModalOnConfirm , setConfirmModalOnConfirm] = useState(() => () => {});

    const {data: totalCnt= 0, reCounting} = useCommentTotalCountQuery({word: searchWord, delYn:'N'});
    const {data: comments, isLoading, reComment} = useCommentList({size, offset, word: searchWord, delYn:'N'});
    const {data: statusCodes} = useCodeGroupSearch('REPORT_STATUS', true);

    const onDeleteClick = (comment) => {
      setIsModalOpen(true);
      setConfirmModalContent(comment.content.length > 100 ? comment.content.slice(0, 100) + '...' : comment.content);
      const deleteData = {
        postId: comment.postId,
        delYn: 'Y',
      };
      setConfirmModalOnConfirm(() => () => {
        deleteCommentMutation.mutate(deleteData, {
            onSuccess: () => {          
            reComment();
            reCounting();
            setIsModalOpen(false);
            },
            onError: (error) => {
            console.error('게시글 삭제 실패:', error);
            setIsModalOpen(false);
            },
        });
      });
    };

    //리셋
    const handleReset = () => {
        setSize(10);
        setOffset(0);
        setSearchInput('');
        setSearchWord('');
    }
    
    //조회
    const onCommentSearch = () => {
        setOffset(0);
        setSearchWord(searchInput);
    };

    const totalPages = Math.ceil(totalCnt / size) || 1;
    const currentPage = Math.floor(offset / size) + 1;
    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        const newOffset = (pageNumber - 1) * size;
        setOffset(newOffset);
    }
    
    return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 border-0 shadow-sm">
          <CCardHeader className="bg-white border-0 py-3">
            <CRow className="align-items-center">
              <CCol md={6} lg={4}> 
                <div className="d-flex align-items-center"> 
                    <CFormInput 
                    size="sm" 
                    placeholder="댓글 또는 작성자로 검색" 
                    className="me-2 py-1.5" 
                    style={{ maxWidth: '200px' }}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyUp={(e) => e.key === 'Enter' && onCommentSearch()}
                    />
                    <CButton 
                    size="sm" 
                    color="success" 
                    className="text-white me-1 text-nowrap px-3"
                    active
                    onClick={onCommentSearch}
                    >
                    검색
                    </CButton>
                    <CButton 
                    size="sm" 
                    color="secondary" 
                    variant="outline"
                    className="text-nowrap"
                    active
                    onClick={handleReset}
                    >
                    초기화
                    </CButton>
                </div>
                </CCol>
              
              <CCol md={8} className="text-end">
                <span className="small text-body-secondary">총 <strong>{totalCnt}</strong>개</span>
              </CCol>
            </CRow>
          </CCardHeader>

          <CCardBody>
            <CTable align="middle" hover responsive className="border-top">
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell className="text-center" style={{ width: '50px' }}>No.</CTableHeaderCell>
                  <CTableHeaderCell>댓글 내용</CTableHeaderCell>
                  <CTableHeaderCell>작성자</CTableHeaderCell>
                  <CTableHeaderCell>게시글</CTableHeaderCell>
                  <CTableHeaderCell>작성일</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">상태</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">관리</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {isLoading ? (
                  <CTableRow>
                    <CTableDataCell colSpan="7" className="text-center py-4 text-muted">
                      데이터를 불러오는 중입니다...
                    </CTableDataCell>
                  </CTableRow>
                ) :Array.isArray(comments) && comments.length > 0 ? (
                  comments.map((item, index) => (
                    <CTableRow key={item.id || index}>
                      <CTableDataCell>{offset + index + 1}</CTableDataCell>
                      <CTableDataCell>{item.content}</CTableDataCell>
                      <CTableDataCell>{item.nickname}</CTableDataCell>
                      <CTableDataCell>{item.title}</CTableDataCell>
                      <CTableDataCell>{item.createdAt}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <StatusBadge status={statusCodes?.[item.reportStatusCode] || '정상'} />
                      </CTableDataCell>
                      <CTableDataCell className="text-center align-middle">
                        <CButton
                        variant="outline" 
                        color="danger" 
                        size="sm" 
                        className="px-3 py-1 rounded-pill" 
                        style={{ fontSize: '12px' }}
                        onClick={() => onDeleteClick?.(item)}
                        active
                        >
                        삭제
                        </CButton>
                    </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="7" className="text-center text-muted py-3">
                      데이터가 없습니다.
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>

            {/* 하단 페이지네이션 */}
            <CommonPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CommonConfirmModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={confirmModalTitle}
        targetContent={confirmModalContent}
        guide={confirmModalGuide}
        writer={confirmModalWriter}
        onConfirm={confirmModalOnConfirm}
      />
    </CRow>
  )
}

export default CommentBoard