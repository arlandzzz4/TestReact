import React from 'react';
import { NavLink } from 'react-router-dom';
import { CNavLink } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilChevronRight } from '@coreui/icons';

const ViewAllButton = ({ to }) => {
  return (
    <CNavLink 
      to={to} 
      as={NavLink} 
      className="p-0 d-inline-flex align-items-center small text-decoration-none text-muted"
      style={{ cursor: 'pointer' }}
    >
      전체 보기
      <CIcon icon={cilChevronRight} size="sm" className="ms-1" />
    </CNavLink>
  );
};

export default ViewAllButton;