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
} from '@coreui/react'
import { useCodeGroupSearch } from '@/hooks/queries/useCommonQuery';
import StatusBadge from '../common/StatusBadge';
import CommonPagination from '../common/CommonPagination';
import { usePostList, usePostTotalCountQuery } from '@/hooks/queries/usePostQuery';
import CommonConfirmModal from '../common/CommonConfirmModal'
import { useDeletePostMutation } from '@/hooks/mutations/usePostMutation'
import { useAuth } from '../../../hooks/useAuth'
import { useNavigate } from 'react-router-dom';

const PostBoard = () => {
    const [size, setSize] = useState(10);
    const [offset, setOffset] = useState(0);
    const [searchInput, setSearchInput] = useState(''); 
    const [searchWord, setSearchWord] = useState('');
    const { user } = useAuth();
    const deletePostMutation = useDeletePostMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [confirmModalTitle, setConfirmModalTitle] = useState('게시글을 삭제하시겠습니까?');
    const [confirmModalContent, setConfirmModalContent] = useState('');
    const [confirmModalGuide, setConfirmModalGuide] = useState('삭제된 게시글은 복구할 수 없습니다.\n해당 게시글의 댓글도 함께 삭제됩니다.');
    const [confirmModalWriter, setConfirmModalWriter] = useState('');
    const [confirmModalOnConfirm , setConfirmModalOnConfirm] = useState(() => () => {});

    const {data: totalCnt= 0, reCounting} = usePostTotalCountQuery({word: searchWord, delYn:'N'});
    const {data: posts, isLoading, refetch} = usePostList({size, offset, word: searchWord, delYn:'N'});
    const {data: statusCodes} = useCodeGroupSearch('REPORT_STATUS', true);

    const navigate = useNavigate();

    const onDeleteClick = (post) => {
      setIsModalOpen(true);
      setConfirmModalContent(post.title.length > 100 ? post.title.slice(0, 100) + '...' : post.title);
      setConfirmModalWriter(post.nickname);
      const deleteData = {
        postId: post.postId,
        deletedId: user.email,
        delYn: 'Y',
      };
      setConfirmModalOnConfirm(() => () => {
        deletePostMutation.mutate(deleteData, {
            onSuccess: () => {          
            refetch();
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
    const onPostSearch = () => {
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
                    placeholder="제목 또는 작성자로 검색" 
                    className="me-2 py-1.5" 
                    style={{ maxWidth: '200px' }}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyUp={(e) => e.key === 'Enter' && onPostSearch()}
                    />
                    <CButton 
                    size="sm" 
                    color="success" 
                    className="text-white me-1 text-nowrap px-3"
                    active
                    onClick={onPostSearch}
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
                  <CTableHeaderCell>닉네임</CTableHeaderCell>
                  <CTableHeaderCell>이메일</CTableHeaderCell>
                  <CTableHeaderCell>가입일</CTableHeaderCell>
                  <CTableHeaderCell>댓글</CTableHeaderCell>
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
                ) :Array.isArray(posts) && posts.length > 0 ? (
                  posts.map((item, index) => (
                    <CTableRow key={item.id || index}>
                      <CTableDataCell>{offset + index + 1}</CTableDataCell>
                      <CTableDataCell>
                        <div 
        onClick={() => {
          if (item.postId) {
            navigate(`/post/${item.postId}`); // 2. 클릭 시 이동
          } else {
            console.error("postId가 없습니다!", item);
          }
        }}
        className="text-dark fw-bold"
        style={{ cursor: 'pointer', textDecoration: 'none' }}
      >
                            {item.title}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>{item.nickname}</CTableDataCell>
                      <CTableDataCell>{item.createdAt}</CTableDataCell>
                      <CTableDataCell>{item.comments}</CTableDataCell>
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

export default PostBoard