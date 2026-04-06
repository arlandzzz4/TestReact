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
  CCol
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {cilClipboard} from '@coreui/icons'
import { useCodeGroupSearch } from '@/hooks/queries/useCommonQuery';
import CommonPagination from '../comment/CommonPagination';

const PostReport = ({ 
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

    <CTable align="middle" hover responsive className="border-top">
      <CTableHead color="light">
        <CTableRow>
          <CTableHeaderCell className="text-center" style={{ width: '50px' }}>No.</CTableHeaderCell>
          <CTableHeaderCell >신고된 게시글</CTableHeaderCell>
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
        ) : Array.isArray(postReports) && postReports.length > 0 ? (
          postReports.map((report, index) => (
            <CTableRow key={report.id || index}>
              <CTableDataCell >
                {(postCurrentPage - 1) * 10 + index + 1}
              </CTableDataCell>
              <CTableDataCell >{report.content}</CTableDataCell>
              <CTableDataCell >{report.targetNickname}</CTableDataCell>
              <CTableDataCell >{report.reporterNickname}</CTableDataCell>
              <CTableDataCell >
                <span className="badge bg-light text-dark rounded-pill px-2 py-1">
                  {statusCodes?.[report.reasonCode] || report.reasonCode}
                </span>
              </CTableDataCell>
              <CTableDataCell >{report.createdAt}</CTableDataCell>
              <CTableDataCell className="text-center align-middle">
                <CButton 
                  variant="outline" 
                  color="danger" 
                  size="sm" 
                  className="px-3 py-1 rounded-pill" 
                  style={{ fontSize: '12px' }}
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

export default PostReport