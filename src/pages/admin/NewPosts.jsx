import { CCard, CCardHeader, CCardBody, CTable, CBadge, CLink } from '@coreui/react'
import { usePostList } from '@/hooks/queries/usePostQuery';

const NewPosts = () => {
  const {data} = usePostList({limit:5});

  return (
    <CCard className="mb-4 border-0 shadow-sm">
      <CCardHeader className="bg-white border-0 d-flex justify-content-between align-items-center pt-3">
        <h5 className="mb-0 fw-bold">최근 게시글</h5>
        <CLink to="/admin/post" className="small text-decoration-none text-muted">전체 보기</CLink>
      </CCardHeader>
      <CCardBody>
        <CTable hover responsive align="middle" className="mb-0 small">
          <thead className="table-light">
            <tr>
              <th className="border-0">제목</th>
              <th className="border-0">작성자</th>
              <th className="border-0">작성일</th>
              <th className="border-0">댓글</th>
              <th className="border-0 text-center">상태</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) =>
              <tr key={item.id || index}>
              <td>{item.title}</td>
              <td>{item.nickname}</td>
              <td>{item.createdAt}</td>
              <td>{item.comments}</td>
              <td className="text-center"><CBadge color="info-soft" className="text-info">{item.delYn}</CBadge></td>
            </tr>
            )}
          </tbody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default NewPosts