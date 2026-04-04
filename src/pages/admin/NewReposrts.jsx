import { CCard, CCardHeader, CCardBody, CTable, CBadge, CLink } from '@coreui/react'
import { useReportList } from '@/hooks/queries/useReportQuery';

const NewReposrts = () => {
  const {data, isLoading} = useReportList({size:5});
  return (
    <CCard className="mb-4 border-0 shadow-sm">
          <CCardHeader className="bg-white border-0 d-flex justify-content-between align-items-center pt-3">
            <h5 className="mb-0 fw-bold">최근 신고</h5>
            <CLink to="/admin/report" className="small text-decoration-none text-muted">전체 보기</CLink>
          </CCardHeader>
          <CCardBody>
            <CTable hover responsive align="middle" className="mb-0 small">
              <thead className="table-light">
                <tr>
                  <th className="border-0">신고 내용</th>
                  <th className="border-0">유형</th>
                  <th className="border-0">접수 시간</th>
                  <th className="border-0 text-center">상태</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">
                      데이터를 불러오는 중입니다...
                    </td>
                  </tr>
                ) : Array.isArray(data) && data.length > 0 ? (
                  data.map((item, index) => (
                  <tr key={index}>
                  <td>{item.detail}</td>
                  <td>{item.reason_code}</td>
                  <td>{item.createdAt}</td>
                  <td>{item.reportStatusCode}</td>
                  <td className="text-center"><CBadge color="info-soft" className="text-info">{item.delYn}</CBadge></td>
                </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-3">
                      데이터가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </CTable>
          </CCardBody>
        </CCard>
  )
}


export default NewReposrts