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

const CommentReport = ({
  activeKey,
  commentReports,
  isLoading,
  onPageChange,
  commentTotalPages,
  commentCurrentPage,
  onDeleteClick
}) => {
  const { data: statusCodes } = useCodeGroupSearch('REPORT_REASON', true);

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
            <CTableHeaderCell >접수일</CTableHeaderCell>
            <CTableHeaderCell className="text-center">관리</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
            <CTableBody>
              {isLoading ? (
                <CTableRow>
                  <CTableDataCell colSpan="7" className="text-center py-4 text-muted">
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
                      {report.content?.length > 30 ? report.content.slice(0, 30) + '...' : report?.content || ''}
                    </CTableDataCell>
                    
                    <CTableDataCell >{report.targetNickname}</CTableDataCell>
                    <CTableDataCell >{report.reporterNickname}</CTableDataCell>
                    <CTableDataCell >
                      <span className="badge bg-light text-dark rounded-pill px-2 py-1"></span>
                      {statusCodes?.[report.reasonCode] || report.reasonCode}
                    </CTableDataCell>
                    <CTableDataCell >{report.createdAt}</CTableDataCell>
                    <CTableDataCell className="text-center align-middle">
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
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="7" className="text-center text-muted py-3">
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