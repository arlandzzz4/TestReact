import { CCard, CCardHeader, CCardBody, CTable, CBadge, CLink } from '@coreui/react'

const NewReposrts = () => {

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
                <tr>
                  <td>건강러버</td>
                  <td>health@email.com</td>
                  <td>2026-03-25</td>
                  <td className="text-center"><CBadge color="info-soft" className="text-info">활성</CBadge></td>
                </tr>
              </tbody>
            </CTable>
          </CCardBody>
        </CCard>
  )
}

export default NewReposrts