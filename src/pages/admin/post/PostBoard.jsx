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
import CommonPagination from '../comment/CommonPagination';
import { usePostList, usePostTotalCountQuery } from '@/hooks/queries/usePostQuery';

const PostBoard = () => {
    const [size, setSize] = useState(10);
    const [offset, setOffset] = useState(0);
    const [searchInput, setSearchInput] = useState(''); 
    const [searchWord, setSearchWord] = useState('');


    const {data: totalCnt= 0} = usePostTotalCountQuery({word: searchWord});
    const {data, isLoading, refetch} = usePostList({size, offset, word: searchWord});
    const {data: statusCodes} = useCodeGroupSearch('REPORT_STATUS', true);

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
                <span className="small text-body-secondary">총 <strong>{totalCnt}</strong>명</span>
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
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {isLoading ? (
                  <CTableRow>
                    <CTableDataCell colSpan="6" className="text-center py-4 text-muted">
                      데이터를 불러오는 중입니다...
                    </CTableDataCell>
                  </CTableRow>
                ) :Array.isArray(data) && data.length > 0 ? (
                  data.map((item, index) => (
                    <CTableRow key={item.id || index}>
                      <CTableDataCell>{offset + index + 1}</CTableDataCell>
                      <CTableDataCell>{item.title}</CTableDataCell>
                      <CTableDataCell>{item.nickname}</CTableDataCell>
                      <CTableDataCell>{item.createdAt}</CTableDataCell>
                      <CTableDataCell>{item.comments}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <StatusBadge status={statusCodes?.[item.reportStatusCode] || '정상'} />
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="6" className="text-center text-muted py-3">
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
    </CRow>
  )
}

export default PostBoard