
import DashUserCard from './DashUserCard'
import DashPostCard from './DashPostCard'
import DashCommentCard from './DashCommentCard'
import DashReportCard from './DashReportCard'
import {
  CCard,
  CCardBody,
  CFormCheck,
  CButton,
  CContainer,
  CRow,
  CCol,
} from '@coreui/react';

const TotalCount = () => {

  return (
    <CRow className="mb-4">
      <DashUserCard/>
      <DashPostCard/>
      <DashCommentCard/>
      <DashReportCard/>
    </CRow>
  )
}

export default TotalCount