import React from 'react'
import { CPagination, CPaginationItem } from '@coreui/react'
import PropTypes from 'prop-types'

const CommonPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  const pageLimit = 10;
  const startPage = Math.floor((currentPage - 1) / pageLimit) * pageLimit + 1;
  const endPage = Math.min(startPage + pageLimit - 1, totalPages);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="d-flex justify-content-center mt-4">
      <CPagination aria-label="Page navigation">
        {/* '처음으로' 버튼 (10페이지 이후부터 표시) */}
        {startPage > 1 && (
          <CPaginationItem onClick={() => onPageChange(1)} style={{ cursor: 'pointer' }}>
            First
          </CPaginationItem>
        )}

        {/* 이전 페이지 버튼 */}
        <CPaginationItem 
          disabled={currentPage === 1} 
          onClick={() => onPageChange(currentPage - 1)}
          style={{ cursor: currentPage === 1 ? 'default' : 'pointer' }}
        >
          &laquo;
        </CPaginationItem>
        
        {/* 계산된 블록 내의 페이지 번호들 */}
        {pages.map((pageNumber) => (
          <CPaginationItem
            key={pageNumber}
            active={currentPage === pageNumber}
            onClick={() => onPageChange(pageNumber)}
            style={{ cursor: 'pointer' }}
          >
            {pageNumber}
          </CPaginationItem>
        ))}

        {/* 다음 페이지 버튼 */}
        <CPaginationItem 
          disabled={currentPage === totalPages} 
          onClick={() => onPageChange(currentPage + 1)}
          style={{ cursor: currentPage === totalPages ? 'default' : 'pointer' }}
        >
          &raquo;
        </CPaginationItem>

        {/* '마지막으로' 버튼 (다음 블록이 있을 때 표시) */}
        {endPage < totalPages && (
          <CPaginationItem onClick={() => onPageChange(totalPages)} style={{ cursor: 'pointer' }}>
            Last
          </CPaginationItem>
        )}
      </CPagination>
    </div>
  )
}

CommonPagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
}

export default CommonPagination