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
import CommonPagination from '../comment/CommonPagination';

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

      <CTable hover responsive align="middle" className="mb-0 custom-table">
        <CTableHead>
          <CTableRow className="text-secondary small" style={{ borderBottom: '2px solid #e0e0e0' }}>
            <CTableHeaderCell className="border-0 text-center py-3" style={{ width: '60px' }}>No.</CTableHeaderCell>
            <CTableHeaderCell className="border-0 py-3">신고된 댓글 내용</CTableHeaderCell>
            <CTableHeaderCell className="border-0 py-3">작성자</CTableHeaderCell>
            <CTableHeaderCell className="border-0 py-3">신고자</CTableHeaderCell>
            <CTableHeaderCell className="border-0 py-3">신고 사유</CTableHeaderCell>
            <CTableHeaderCell className="border-0 py-3">접수일</CTableHeaderCell>
            <CTableHeaderCell className="border-0 text-center py-3" style={{ width: '100px' }}>관리</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
            <CTableBody>
              {isLoading ? (
                <CTableRow>
                  <CTableDataCell colSpan="7" className="text-center py-5 text-muted bg-white">
                    <div className="spinner-border spinner-border-sm text-success me-2" role="status"></div>
                    데이터를 불러오는 중입니다...
                  </CTableDataCell>
                </CTableRow>
              ) : Array.isArray(commentReports) && commentReports.length > 0 ? (
                commentReports.map((report, index) => (
                  <CTableRow key={report.id || index} className="small">
                    <CTableDataCell className="text-center text-secondary py-3">
                      {(commentCurrentPage - 1) * 10 + index + 1}
                    </CTableDataCell>
                    
                    <CTableDataCell className="fw-bold text-dark py-3" style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {report.content}
                    </CTableDataCell>
                    
                    <CTableDataCell className="py-3">{report.targetNickname}</CTableDataCell>
                    <CTableDataCell className="py-3">{report.reporterNickname}</CTableDataCell>
                    <CTableDataCell className="py-3">
                      <span className="badge bg-light text-dark rounded-pill px-2 py-1"></span>
                      {statusCodes?.[report.reasonCode] || report.reasonCode}
                    </CTableDataCell>
                    <CTableDataCell className="text-secondary py-3">{report.createdAt}</CTableDataCell>
                    <CTableDataCell className="text-center py-3">
                      <CButton 
                        variant="outline" 
                        color="danger" 
                        size="sm" 
                        className="px-3 py-1 rounded-pill" 
                        style={{ fontSize: '12px', opacity: 0.7 }}
                        onClick={() => onDeleteClick?.(report)}
                      >
                        삭제
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="7" className="text-center text-muted py-5 bg-white">
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