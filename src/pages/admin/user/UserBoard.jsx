import React, {useState} from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormInput,
  CButton,
  CButtonGroup,
} from '@coreui/react'
import { useUserList } from '@/hooks/queries/useUserQuery';
import { useCodeGroupSearch } from '@/hooks/queries/useCommonQuery';
import StatusBadge from '../common/StatusBadge';
import { useUserTotalCountQuery } from '@/hooks/queries/useUserQuery';
import CommonPagination from '../comment/CommonPagination';
import UserStatusModal from './UserStatusModal';

const UserBoard = () => {
    const [size, setSize] = useState(10);
    const [offset, setOffset] = useState(0);
    const [userStatus, setUserStatus] = useState('');
    const [emailInput, setEmailInput] = useState(''); 
    const [searchEmail, setSearchEmail] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const {data: totalCnt= 0} = useUserTotalCountQuery();
    const {data, isLoading, refetch} = useUserList({size, offset, userStatus, email: searchEmail});
    const {data: statusCodes} = useCodeGroupSearch('USER_STATUS', true);

    //리셋
    const handleReset = () => {
        setSize(10);
        setOffset(0);
        setUserStatus('');
        setEmailInput('');
        setSearchEmail('');
    }
    // 상태 필터링
    const handleUserStatusChange = (value) => {
        setUserStatus(value)
        console.log("선택된 상태값:", value);
    }
    // 상세보기 모달
    const handleDetailClick = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    }
    
    //조회
    const onUserSearch = () => {
        setOffset(0);
        setSearchEmail(emailInput);
    };

    const totalPages = Math.ceil(totalCnt / size) || 1;
    const currentPage = Math.floor(offset / size) + 1;
    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        const newOffset = (pageNumber - 1) * size;
        setOffset(newOffset);
    }

    const handleApplyStatus = (newStatus) => {
        try {
            // 사용자 상태변경
            // TODO: API 호출로 상태 변경 로직 구현 (예: await updateUserStatus(selectedUser.id, newStatus))

            // API 호출이 성공하면 모달을 닫습니다.
            setIsModalOpen(false);

            // 재조회
            refetch();

        } catch (error) {
            console.error('상태 변경 실패:', error);
            alert('상태 변경 중 오류가 발생했습니다.');
        }
    }
    
    return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 border-0 shadow-sm">
          <CCardHeader className="bg-white border-0 py-3">
            <CRow className="align-items-center">
              <CCol md={6} lg={4}> {/* 반응형을 고려해 너비를 살짝 조절했습니다 */}
                <div className="d-flex align-items-center"> 
                    <CFormInput 
                    size="sm" // 높이를 줄여 슬림하게 만듭니다
                    placeholder="이메일로 검색" 
                    className="me-2 py-1.5" // 상하 여백 미세 조정
                    style={{ maxWidth: '200px' }} // 입력창이 너무 길어지지 않게 제한
                    value={emailInput} // 3. State 바인딩
                    onChange={(e) => setEmailInput(e.target.value)} // 입력값 갱신
                    onKeyUp={(e) => e.key === 'Enter' && onUserSearch()}
                    />
                    <CButton 
                    size="sm" 
                    color="success" 
                    className="text-white me-1 text-nowrap px-3"
                    onClick={onUserSearch}
                    >
                    검색
                    </CButton>
                    <CButton 
                    size="sm" 
                    color="secondary" 
                    variant="outline"
                    className="text-nowrap"
                    onClick={handleReset}
                    >
                    초기화
                    </CButton>
                </div>
                </CCol>
              
              {/* 오른쪽: 필터 및 총 인원 */}
              <CCol md={8} className="text-end">
                <CButtonGroup className="me-3">
                  <CButton color="dark" variant="outline" active={userStatus === ''} onClick={() => handleUserStatusChange('')} size="sm">전체</CButton>
                  <CButton color="dark" variant="outline" active={userStatus === '01'} onClick={() => handleUserStatusChange('01')} size="sm">활성</CButton>
                  <CButton color="dark" variant="outline" active={userStatus === '02'} onClick={() => handleUserStatusChange('02')} size="sm">정지</CButton>
                </CButtonGroup>
                <span className="small text-body-secondary">총 <strong>{totalCnt}</strong>명</span>
              </CCol>
            </CRow>
          </CCardHeader>

          <CCardBody>
            <CTable align="middle" hover responsive className="border-top">
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell className="text-center" style={{ width: '50px' }}>No.</CTableHeaderCell>
                  <CTableHeaderCell>닉네임</CTableHeaderCell>
                  <CTableHeaderCell>이메일</CTableHeaderCell>
                  <CTableHeaderCell>가입일</CTableHeaderCell>
                  <CTableHeaderCell>게시글</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">상태</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">관리</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {isLoading ? (
                  <CTableRow>
                    <CTableDataCell colSpan="7" className="text-center py-4 text-muted">
                      데이터를 불러오는 중입니다...
                    </CTableDataCell>
                  </CTableRow>
                ) :Array.isArray(data) && data.length > 0 ? (
                  data.map((item, index) => (
                    <CTableRow key={item.id || index}>
                      <CTableDataCell>{offset + index + 1}</CTableDataCell>
                      <CTableDataCell>{item.nickname}</CTableDataCell>
                      <CTableDataCell>{item.email}</CTableDataCell>
                      <CTableDataCell>{item.createdAt}</CTableDataCell>
                      <CTableDataCell>{item.postCnt}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <StatusBadge status={statusCodes?.[item.userStatusCode] || item.userStatusCode} />
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton 
                          color="light" 
                          size="sm" 
                          className="border"
                          onClick={() => handleDetailClick(item)}
                        >
                          상세
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="7" className="text-center text-muted py-3">
                      데이터가 없습니다.
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>

            {/* 하단 페이지네이션 */}
            <CommonPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            />
          </CCardBody>
        </CCard>
      </CCol>
         {/* 사용자 상태 변경 모달 */}
      <UserStatusModal 
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedUser={selectedUser}
        onApply={handleApplyStatus}
      />
    </CRow>
  )
}

export default UserBoard