import { CCard, CCardHeader, CCardBody, CTable, CBadge, CNavLink, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react'
import { usePostList } from '@/hooks/queries/usePostQuery';
//import { useCodeGroupSearch } from '@/hooks/queries/useCommonQuery';
import { NavLink } from 'react-router-dom'
import ViewAllButton from './ViewAllButton';
const NewPosts = () => {
  const {data, isLoading} = usePostList({size:5});
  //const {data: statusCodes} = useCodeGroupSearch('USER_STATUS', true);
  return (
    <CCard className="mb-4 border-0 shadow-sm">
      <CCardHeader className="bg-white border-0 d-flex justify-content-between align-items-center pt-3">
        <h5 className="mb-0 fw-bold">최근 게시글</h5>
        <ViewAllButton to="/admin/posts" />
      </CCardHeader>
      <CCardBody>
        <CTable hover responsive align="middle" className="mb-0 small">
          <CTableHead className="table-light">
            <CTableRow>
              <CTableHeaderCell className="border-0">제목</CTableHeaderCell>
              <CTableHeaderCell className="border-0">작성자</CTableHeaderCell>
              <CTableHeaderCell className="border-0">작성일</CTableHeaderCell>
              <CTableHeaderCell className="border-0">댓글 수</CTableHeaderCell>
              <CTableHeaderCell className="border-0 text-center">삭제 여부</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {isLoading ? (
              <CTableRow>
                <CTableDataCell colSpan="5" className="text-center py-4 text-muted">
                  데이터를 불러오는 중입니다...
                </CTableDataCell>
              </CTableRow>
            ) : Array.isArray(data) && data.length > 0 ? (
              data.map((item, index) => (
              <CTableRow key={item.id || index}>
              <CTableDataCell>{item.title}</CTableDataCell>
              <CTableDataCell>{item.nickname}</CTableDataCell>
              <CTableDataCell>{item.createdAt}</CTableDataCell>
              <CTableDataCell>{item.comments}</CTableDataCell>
              <CTableDataCell className="text-center"><CBadge color="info-soft" className="text-info">{item.delYn}</CBadge></CTableDataCell>
            </CTableRow>
            ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="5" className="text-center text-muted py-3">
                      데이터가 없습니다.
                    </CTableDataCell>
                  </CTableRow>
                )}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}


export default NewPosts