import { CCard, CCardHeader, CCardBody, CTable, CBadge, CLink } from '@coreui/react'
import { useUserList } from '@/hooks/queries/useUserQuery';

const NewUsers = () => {
  const {data, isLoading} = useUserList({size:5});
  return (
    <CCard className="mb-4 border-0 shadow-sm">
          <CCardHeader className="bg-white border-0 d-flex justify-content-between align-items-center pt-3">
            <h5 className="mb-0 fw-bold">최근 가입 회원</h5>
            <CLink to="/admin/user" className="small text-decoration-none text-muted">전체 보기</CLink>
          </CCardHeader>
          <CCardBody>
            <CTable hover responsive align="middle" className="mb-0 small">
              <thead className="table-light">
                <tr>
                  <th className="border-0">닉네임</th>
                  <th className="border-0">이메일</th>
                  <th className="border-0">가입일</th>
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
                ) :Array.isArray(data) && data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>{item.nickname}</td>
                      <td>{item.email}</td>
                      <td>{item.createdAt}</td>
                      <td className="text-center">
                        <CBadge color="info-soft" className="text-info">{item.delYn}</CBadge>
                      </td>
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

export default NewUsers