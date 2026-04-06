import React from 'react'
import { CPagination, CPaginationItem } from '@coreui/react'
import PropTypes from 'prop-types'

const CommonPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  return (
    <div className="d-flex justify-content-center mt-4">
      <CPagination aria-label="Page navigation">
        {/* 이전 페이지 버튼 */}
        <CPaginationItem 
          disabled={currentPage === 1} 
          onClick={() => onPageChange(currentPage - 1)}
          style={{ cursor: currentPage === 1 ? 'default' : 'pointer' }}
        >
          &laquo;
        </CPaginationItem>
        
        {/* 페이지 번호들 */}
        {[...Array(totalPages)].map((_, i) => {
          const pageNumber = i + 1
          return (
            <CPaginationItem
              key={pageNumber}
              active={currentPage === pageNumber}
              onClick={() => onPageChange(pageNumber)}
              style={{ cursor: 'pointer' }}
            >
              {pageNumber}
            </CPaginationItem>
          )
        })}

        {/* 다음 페이지 버튼 */}
        <CPaginationItem 
          disabled={currentPage === totalPages} 
          onClick={() => onPageChange(currentPage + 1)}
          style={{ cursor: currentPage === totalPages ? 'default' : 'pointer' }}
        >
          &raquo;
        </CPaginationItem>
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