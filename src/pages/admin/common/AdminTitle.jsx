import React from 'react'
import { CCard, CCardHeader, CCardBody } from '@coreui/react'

const AdminTitle = ({title, description}) => {
  return (
    <CCard className="mb-4 border-0 shadow-sm">
      <CCardHeader className="bg-white border-0 py-3">
        <div className="d-flex align-items-baseline">
          <h1 
            className="fw-bold text-dark mb-0 me-2" 
            style={{ fontSize: 'clamp(20px, 3vw, 26px)', letterSpacing: '-0.5px' }}
          >
            {title}
          </h1>
        </div>
      </CCardHeader>
      <CCardBody className="pt-0">
        <p className="text-body-secondary small mb-0">
          <i className="cil-info-circle me-1"></i>
          {description}
        </p>
      </CCardBody>
    </CCard>
  )
}

export default AdminTitle