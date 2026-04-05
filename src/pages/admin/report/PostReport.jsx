import React from 'react'
import {
  CCard,
  CCardBody,
  CTabPane,
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
      <CRow className="mb-2 align-items-center">
        <CCol>
          <div className="ms-1 small text-body-secondary">
            총 <strong>{postReports?.length || 0}</strong>건
          </div>
        </CCol>
      </CRow>

      <CCard className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
        <CCardBody className="p-0">
          <CTable hover responsive align="middle" className="mb-0">
            <CTableHead color="light">
              <CTableRow className="text-secondary small">
                <CTableHeaderCell className="border-0 text-center" style={{ width: '60px' }}>No.</CTableHeaderCell>
                <CTableHeaderCell className="border-0">신고된 게시글</CTableHeaderCell>
                <CTableHeaderCell className="border-0">작성자</CTableHeaderCell>
                <CTableHeaderCell className="border-0">신고자</CTableHeaderCell>
                <CTableHeaderCell className="border-0">신고 사유</CTableHeaderCell>
                <CTableHeaderCell className="border-0">접수일</CTableHeaderCell>
                <CTableHeaderCell className="border-0 text-center" style={{ width: '100px' }}>관리</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {isLoading ? (
                <CTableRow>
                  <CTableDataCell colSpan="7" className="text-center py-4 text-muted">
                    데이터를 불러오는 중입니다...
                  </CTableDataCell>
                </CTableRow>
              ) : Array.isArray(postReports) && postReports.length > 0 ? (
                postReports.map((report, index) => (
                  <CTableRow key={report.id || index} className="small">
                    <CTableDataCell className="text-center text-secondary">
                      {(postCurrentPage - 1) * 10 + index + 1}
                    </CTableDataCell>
                    <CTableDataCell className="fw-bold">{report.content}</CTableDataCell>
                    <CTableDataCell>{report.targetNickname}</CTableDataCell>
                    <CTableDataCell>{report.reporterNickname}</CTableDataCell>
                    <CTableDataCell>
                      {statusCodes?.[report.reasonCode] || report.reasonCode}
                    </CTableDataCell>
                    <CTableDataCell className="text-secondary">{report.createdAt}</CTableDataCell>
                    <CTableDataCell className="text-center">
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
                  <CTableDataCell colSpan="7" className="text-center text-muted py-5">
                    신고된 내역이 없습니다.
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>

          <div className="py-3">
            <CommonPagination 
              currentPage={postCurrentPage}
              totalPages={postTotalPages}
              onPageChange={onPageChange}
            />
          </div>
        </CCardBody>
      </CCard>
    </>
  )
}

export default ReportReport