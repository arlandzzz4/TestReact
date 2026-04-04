import React, { useState, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CRow,
  CCol,
  CCard,
  CCardBody,
} from '@coreui/react'
import PropTypes from 'prop-types'

const UserStatusModal = ({ visible, onClose, selectedUser, onApply }) => {
  // 사용자가 임시로 선택한 상태를 저장하는 로직
  const [tempStatus, setTempStatus] = useState('')

  // 모달이 열릴 때마다 사용자의 현재 상태로 초기화
  useEffect(() => {
    if (selectedUser) {
      setTempStatus(selectedUser.userStatusCode)
    }
  }, [selectedUser])

  // 카드 스타일 정의 (이미지와 동일하게)
  const cardStyle = {
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderRadius: '16px',
  }

  const selectedStyle = {
    ...cardStyle,
    borderColor: '#3c4b64', // CoreUI dark 색상
    borderWidth: '2px',
    backgroundColor: '#ebf0f5', // 아주 옅은 파란색/회색조
  }

  const unselectedStyle = {
    ...cardStyle,
    borderColor: '#d8dbe0', // 연한 회색
  }

  return (
    <CModal 
      visible={visible} 
      onClose={onClose} 
      alignment="center" // 중앙 정렬
      size="sm" // 작은 크기로 얇게
      className="border-0 shadow-lg"
    >
      <CModalHeader className="border-0 pb-0">
        <CModalTitle>
          <h5 className="fw-bold mb-1">어떠한 상태로 만들겠습니까?</h5>
          {selectedUser && (
            <div className="small text-secondary fw-normal">
              {selectedUser.nickname} · {selectedUser.email}
            </div>
          )}
        </CModalTitle>
      </CModalHeader>
      <CModalBody className="py-4">
        <CRow>
          {/* 활성 카드 */}
          <CCol xs={6}>
            <CCard 
              style={tempStatus === '01' ? selectedStyle : unselectedStyle}
              onClick={() => setTempStatus('01')}
              className="text-center h-100"
            >
              <CCardBody className="py-4">
                <h6 className="fw-bold mb-2">활성</h6>
                <div className="small text-body-secondary text-nowrap">
                  정상적으로 서비스 이<br/>용 가능
                </div>
              </CCardBody>
            </CCard>
          </CCol>
          
          {/* 정지 카드 */}
          <CCol xs={6}>
            <CCard 
              style={tempStatus === '02' ? selectedStyle : unselectedStyle}
              onClick={() => setTempStatus('02')}
              className="text-center h-100"
            >
              <CCardBody className="py-4">
                <h6 className="fw-bold mb-2">정지</h6>
                <div className="small text-body-secondary text-nowrap">
                  서비스 이용 제한
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CModalBody>
      <CModalFooter className="border-0 d-flex justify-content-center pt-0">
        <CButton 
          color="secondary" 
          variant="outline" 
          onClick={onClose}
          size="sm"
          className="me-2 px-3 rounded-pill"
        >
          취소
        </CButton>
        <CButton 
          color="success" 
          onClick={() => onApply(tempStatus)}
          size="sm"
          className="text-white px-3 rounded-pill"
        >
          적용
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

UserStatusModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedUser: PropTypes.object,
  onApply: PropTypes.func.isRequired,
}

export default UserStatusModal