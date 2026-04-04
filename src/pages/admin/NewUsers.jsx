import { CCard, CCardHeader, CCardBody, CTable, CBadge, CNavLink, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react'
import { useUserList } from '@/hooks/queries/useUserQuery';
import { useCodeGroupSearch } from '@/hooks/queries/useCommonQuery';
import StatusBadge from './common/StatusBadge';
import ViewAllButton from './common/ViewAllButton';

const NewUsers = () => {
  const {data, isLoading} = useUserList({size:5});
  const {data: statusCodes} = useCodeGroupSearch('USER_STATUS', true);
  return (
    <CCard className="mb-4 border-0 shadow-sm">
          <CCardHeader className="bg-white border-0 d-flex justify-content-between align-items-center pt-3">
            <h5 className="mb-0 fw-bold">최근 가입 회원</h5>
            <ViewAllButton to="/admin/users" />
          </CCardHeader>
          <CCardBody>
            <CTable hover responsive align="middle" className="mb-0 small">
              <CTableHead className="table-light">
                <CTableRow>
                  <CTableHeaderCell className="border-0">닉네임</CTableHeaderCell>
                  <CTableHeaderCell className="border-0">이메일</CTableHeaderCell>
                  <CTableHeaderCell className="border-0">가입일</CTableHeaderCell>
                  <CTableHeaderCell className="border-0 text-center">상태</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {isLoading ? (
                  <CTableRow>
                    <CTableDataCell colSpan="4" className="text-center py-4 text-muted">
                      데이터를 불러오는 중입니다...
                    </CTableDataCell>
                  </CTableRow>
                ) :Array.isArray(data) && data.length > 0 ? (
                  data.map((item, index) => (
                    <CTableRow key={item.id || index}>
                      <CTableDataCell>{item.nickname}</CTableDataCell>
                      <CTableDataCell>{item.email}</CTableDataCell>
                      <CTableDataCell>{item.createdAt}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CBadge color="info-soft" className="text-info"><StatusBadge status={statusCodes?.[item.userStatusCode] || item.userStatusCode} /></CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="4" className="text-center text-muted py-3">
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

export default NewUsers