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
  CIcon
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {cilClipboard} from '@coreui/icons'
import { useCodeGroupSearch } from '@/hooks/queries/useCommonQuery';
import CommonPagination from '../comment/CommonPagination';

const ReportReport = ({ 
  activeKey, 
  postReports, 
  isLoading, 
  onPageChange, 
  postTotalPages, 
  postCurrentPage,
  onDeleteClick
}) => {
  const { data: statusCodes } = useCodeGroupSearch('REPORT_REASON', true);

return (
  <>
    <CRow className="mb-3 align-items-center">
      <CCol>
        <div className="ms-1 small text-body-secondary">
          총 <strong>{postReports?.length || 0}</strong>건 접수
        </div>
      </CCol>
    </CRow>

    <CTable hover responsive align="middle" className="mb-0 custom-table">
      <CTableHead>
        <CTableRow className="text-secondary small" style={{ borderBottom: '2px solid #e0e0e0' }}>
          <CTableHeaderCell className="border-0 text-center py-3" style={{ width: '60px' }}>No.</CTableHeaderCell>
          <CTableHeaderCell className="border-0 py-3">신고된 게시글</CTableHeaderCell>
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
        ) : Array.isArray(postReports) && postReports.length > 0 ? (
          postReports.map((report, index) => (
            <CTableRow key={report.id || index} className="small bg-white align-middle" style={{ borderBottom: '1px solid #f2f2f2' }}>
              <CTableDataCell className="text-center text-secondary py-3">
                {(postCurrentPage - 1) * 10 + index + 1}
              </CTableDataCell>
              <CTableDataCell className="fw-bold text-dark py-3">{report.content}</CTableDataCell>
              <CTableDataCell className="py-3">{report.targetNickname}</CTableDataCell>
              <CTableDataCell className="py-3">{report.reporterNickname}</CTableDataCell>
              <CTableDataCell className="py-3">
                <span className="badge bg-light text-dark rounded-pill px-2 py-1">
                  {statusCodes?.[report.reasonCode] || report.reasonCode}
                </span>
              </CTableDataCell>
              <CTableDataCell className="text-secondary py-3">{report.createdAt}</CTableDataCell>
              <CTableDataCell className="text-center py-3">
                <CButton 
                  variant="outline" 
                  color="danger" 
                  size="sm" 
                  className="px-3 py-1 rounded-pill" 
                  style={{ fontSize: '12px' }}
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
              신고된 내역이 없습니다.
            </CTableDataCell>
          </CTableRow>
        )}
      </CTableBody>
    </CTable>

    <div className="py-4 bg-white rounded-bottom">
      <CommonPagination 
        currentPage={postCurrentPage}
        totalPages={postTotalPages}
        onPageChange={onPageChange}
      />
    </div>
  </>
)
}

export default ReportReport