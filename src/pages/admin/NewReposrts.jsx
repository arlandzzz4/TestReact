import { CCard, CCardHeader, CCardBody, CTable, CBadge, CNavLink, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react'
import { useReportList } from '@/hooks/queries/useReportQuery';
import { useCodeGroupSearch } from '@/hooks/queries/useCommonQuery';
import ViewAllButton from './ViewAllButton';
const NewReposrts = () => {
  const {data, isLoading} = useReportList({size:5});
  const {data: statusCodes} = useCodeGroupSearch('REPORT_STATUS', true);
  return (
    <CCard className="mb-4 border-0 shadow-sm">
          <CCardHeader className="bg-white border-0 d-flex justify-content-between align-items-center pt-3">
            <h5 className="mb-0 fw-bold">최근 신고</h5>
            <ViewAllButton to="/admin/report" />
          </CCardHeader>
          <CCardBody>
            <CTable hover responsive align="middle" className="mb-0 small">
              <CTableHead className="table-light">
                <CTableRow>
                  <CTableHeaderCell className="border-0">신고 내용</CTableHeaderCell>
                  <CTableHeaderCell className="border-0">유형</CTableHeaderCell>
                  <CTableHeaderCell className="border-0">접수 시간</CTableHeaderCell>
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
                ) : Array.isArray(data) && data.length > 0 ? (
                  data.map((item, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{item.detail}</CTableDataCell>
                    <CTableDataCell>{item.reason_code}</CTableDataCell>
                    <CTableDataCell>{item.createdAt}</CTableDataCell>
                    <CTableDataCell>{item.reportStatusCode}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CBadge color="info-soft" className="text-info">
                        {statusCodes?.[item.reportStatusCode] || item.reportStatusCode}
                      </CBadge>
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


export default NewReposrts