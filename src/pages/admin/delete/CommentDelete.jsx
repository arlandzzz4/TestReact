import React from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CRow,
  CCol,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {cilClipboard} from '@coreui/icons'
import CommonPagination from '../common/CommonPagination'

const CommentDelete = ({
  commentDeletes,
  isLoading,
  onPageChange,
  commentTotalPages,
  commentCurrentPage
}) => {

  return (
    <>
      <CRow className="mb-3 align-items-center">
        <CCol>
          <div className="ms-1 small text-body-secondary">
            총 <strong>{commentDeletes?.length || 0}</strong>건
          </div>
        </CCol>
      </CRow>

      <CTable align="middle" hover responsive className="border-top">
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell className="text-center" style={{ width: '50px' }}>No.</CTableHeaderCell>
            <CTableHeaderCell >댓글 내용</CTableHeaderCell>
            <CTableHeaderCell >작성자</CTableHeaderCell>
            <CTableHeaderCell >원본 날짜</CTableHeaderCell>
            <CTableHeaderCell >삭제일</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
            <CTableBody>
              {isLoading ? (
                <CTableRow>
                  <CTableDataCell colSpan="5" className="text-center py-4 text-muted">
                    <div className="spinner-border spinner-border-sm text-success me-2" role="status"></div>
                    데이터를 불러오는 중입니다...
                  </CTableDataCell>
                </CTableRow>
              ) : Array.isArray(commentDeletes) && commentDeletes.length > 0 ? (
                commentDeletes.map((data, index) => (
                  <CTableRow key={data.id || index} className="small">
                    <CTableDataCell >
                      {(commentCurrentPage - 1) * 10 + index + 1}
                    </CTableDataCell>
                    <CTableDataCell className="fw-bold text-dark py-3" style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {data.content}
                    </CTableDataCell>
                    <CTableDataCell >{data.nickname}</CTableDataCell>
                    <CTableDataCell className="">{data.createdAt}</CTableDataCell>
                    <CTableDataCell className="">{data.deletedAt}</CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="5" className="text-center text-muted py-3">
                    <CIcon icon={cilClipboard} size="xl" className="mb-2 text-secondary opacity-50" /><br />
                    삭제된 댓글 내역이 없습니다.
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>

          <div className="py-3">
            <CommonPagination 
              currentPage={commentCurrentPage}
              totalPages={commentTotalPages}
              onPageChange={onPageChange}
            />
          </div>
    </>
  )
}

export default CommentDelete