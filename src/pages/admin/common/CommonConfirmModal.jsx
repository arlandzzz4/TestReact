import React from 'react'
import {
  CModal,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react'

const CommonConfirmModal = ({ visible, onClose, title, targetContent, guide, writer, onConfirm }) => {
  return (
    <CModal
      visible={visible}
      onClose={onClose}
      alignment="center"
      className="border-0"
      // 모달 전체 둥글기 조절을 위한 스타일
      // style={{ '--cui-modal-border-radius': '25px', '--cui-modal-width': '450px' }}
    >
      <CModalBody className="p-4 text-center">
        {/* 제목 */}
        <h5 className="fw-bold mb-4" style={{ color: '#333' }}>
          {title}
        </h5>

        {/* 게시글 내용 박스 */}
        <div 
          className="p-3 mb-3 text-start" 
          style={{ 
            backgroundColor: '#F8F7F2', 
            borderRadius: '15px',
            border: '1px solid #EFEBE0',
            color: '#666'
          }}
        >
          <span className="fw-medium">"{targetContent}"</span>
          <span className="ms-1" style={{ fontSize: '0.9rem' }}>(작성자: {writer})</span>
        </div>

        {/* 안내 문구 */}
        <p className="text-start mb-0" style={{ color: '#A67C52', fontSize: '0.9rem' }}>
          {guide}
        </p>
      </CModalBody>

      <CModalFooter className="border-0 pb-4 pe-4 justify-content-end">
        {/* 취소 버튼 */}
        <CButton 
          variant="outline" 
          onClick={() => onClose()}
          style={{ 
            borderRadius: '20px', 
            border: '1px solid #EFEBE0', 
            color: '#666',
            padding: '8px 25px'
          }}
        >
          취소
        </CButton>
        {/* 확인 버튼 */}
        <CButton 
          onClick={onConfirm}
          style={{ 
            backgroundColor: '#8D5B3E', 
            border: 'none',
            borderRadius: '20px', 
            color: 'white',
            padding: '8px 25px'
          }}
        >
          확인
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default CommonConfirmModal