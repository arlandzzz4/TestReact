import React from 'react'
import classNames from 'classnames'

// import {
//   CAvatar,
//   CButton,
//   CButtonGroup,
//   CCard,
//   CCardBody,
//   CCardFooter,
//   CCardHeader,
//   CCol,
//   CProgress,
//   CRow,
//   CTable,
//   CTableBody,
//   CTableDataCell,
//   CTableHead,
//   CTableHeaderCell,
//   CTableRow,
// } from '@coreui/react'
// import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  // cilCloudDownload,
  // cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

// 기존 import 제거
// import avatar1 from 'src/assets/images/avatars/1.jpg'
// import avatar2 from 'src/assets/images/avatars/2.jpg'
// import avatar3 from 'src/assets/images/avatars/3.jpg'
// import avatar4 from 'src/assets/images/avatars/4.jpg'
// import avatar5 from 'src/assets/images/avatars/5.jpg'
// import avatar6 from 'src/assets/images/avatars/6.jpg'

// 임시 placeholder 이미지 사용
const avatar1 = 'https://via.placeholder.com/150/FF0000/FFFFFF?text=1'
const avatar2 = 'https://via.placeholder.com/150/00FF00/FFFFFF?text=2'
const avatar3 = 'https://via.placeholder.com/150/0000FF/FFFFFF?text=3'
const avatar4 = 'https://via.placeholder.com/150/FFFF00/FFFFFF?text=4'
const avatar5 = 'https://via.placeholder.com/150/FF00FF/FFFFFF?text=5'
const avatar6 = 'https://via.placeholder.com/150/00FFFF/FFFFFF?text=6'

// import WidgetsBrand from '../widgets/WidgetsBrand'
// import WidgetsDropdown from '../widgets/WidgetsDropdown'
// import MainChart from './MainChart'
import CommunityPosts from './CommunityPosts'
// import Tables from '../base/tables/Tables'

const Dashboard = () => {

  return (
    <>
    <CommunityPosts />
    </>
  )
}

export default Dashboard
