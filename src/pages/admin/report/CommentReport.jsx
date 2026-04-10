import React from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CRow,
  CCol,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {cilClipboard} from '@coreui/icons'
import { useCodeGroupSearch } from '@/hooks/queries/useCommonQuery';
import CommonPagination from '../common/CommonPagination';
import { useNavigate } from 'react-router-dom';

const CommentReport = ({
  activeKey,
  commentReports,
  isLoading,
  onPageChange,
  commentTotalPages,
  commentCurrentPage,
  onDeleteClick
}) => {
  const navigate = useNavigate();
  const {data: statusCodes} = useCodeGroupSearch('REPORT_STATUS', true);
  const { data: reasonCodes } = useCodeGroupSearch('REPORT_REASON', true);
  

  return (
    <>
      <CRow className="mb-3 align-items-center">
        <CCol>
          <div className="ms-1 small text-body-secondary">
            총 <strong>{commentReports?.length || 0}</strong>건
          </div>
        </CCol>
      </CRow>

      <CTable align="middle" hover responsive className="border-top">
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell className="text-center" style={{ width: '50px' }}>No.</CTableHeaderCell>
            <CTableHeaderCell >신고된 댓글 내용</CTableHeaderCell>
            <CTableHeaderCell >작성자</CTableHeaderCell>
            <CTableHeaderCell >신고자</CTableHeaderCell>
            <CTableHeaderCell >신고 사유</CTableHeaderCell>
            <CTableHeaderCell >상태</CTableHeaderCell>
            <CTableHeaderCell >접수일</CTableHeaderCell>
            <CTableHeaderCell className="text-center">관리</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
            <CTableBody>
              {isLoading ? (
                <CTableRow>
                  <CTableDataCell colSpan="8" className="text-center py-4 text-muted">
                    <div className="spinner-border spinner-border-sm text-success me-2" role="status"></div>
                    데이터를 불러오는 중입니다...
                  </CTableDataCell>
                </CTableRow>
              ) : Array.isArray(commentReports) && commentReports.length > 0 ? (
                commentReports.map((report, index) => (
                  <CTableRow key={report.id || index} className="small">
                    <CTableDataCell >
                      {(commentCurrentPage - 1) * 10 + index + 1}
                    </CTableDataCell>
                    
                    <CTableDataCell className="fw-bold text-dark py-3" style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {report.delYn === 'Y' ? (
                        report.content?.length > 30 ? report.content.slice(0, 30) + '...' : report?.content || ''
                      ) : (
                      <div 
                        onClick={() => {
                          if (report.postId) {
                            navigate(`/post/${report.postId}`); // 2. 클릭 시 이동
                          } else {
                            console.error("postId 없습니다!", report);
                          }
                        }}
                        className="text-dark fw-bold"
                        style={{ cursor: 'pointer', textDecoration: 'none' }}
                      >
                      {report.content?.length > 30 ? report.content.slice(0, 30) + '...' : report?.content || ''}
                      </div>
                      )}

                    </CTableDataCell>
                    
                    <CTableDataCell >{report.targetNickname}</CTableDataCell>
                    <CTableDataCell >{report.reporterNickname}</CTableDataCell>
                    <CTableDataCell >
                      <span className="badge bg-light text-dark rounded-pill px-2 py-1">
                      {reasonCodes?.[report.reasonCode] || report.reasonCode}
                      </span>
                    </CTableDataCell>
                    <CTableDataCell >
                      <span className="badge bg-light text-dark rounded-pill px-2 py-1">
                        {statusCodes?.[report.reportStatusCode] || report.reportStatusCode}
                      </span>
                    </CTableDataCell>
                    <CTableDataCell >{report.createdAt}</CTableDataCell>
                    <CTableDataCell className="text-center align-middle">
                      {report.delYn === 'Y' ? (
                        <span style={{ color: 'gray' }}>원본글 삭제됨</span>
                      ) : (
                      <CButton 
                        variant="outline" 
                        color="danger" 
                        size="sm" 
                        className="px-3 py-1 rounded-pill" 
                        style={{ fontSize: '12px', opacity: 0.7 }}
                        onClick={() => onDeleteClick?.(report)}
                        active
                      >
                        삭제
                      </CButton>
                      )}
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="8" className="text-center text-muted py-3">
                    <CIcon icon={cilClipboard} size="xl" className="mb-2 text-secondary opacity-50" /><br />
                    신고된 댓글 내역이 없습니다.
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

export default CommentReport