import React, { useState } from 'react';
import { CRow, CCol, CCard, CCardBody, CCardHeader, CCardFooter, CButton, CPagination, CPaginationItem, CFormInput, CForm } from '@coreui/react';
import '../../scss/MyPage.scss'
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// 임시 글 목록 더미 데이터 (총 10개)
const DUMMY_POSTS = [
  { id: 1, title: '첫 번째 작성한 글입니다.' },
  { id: 2, title: '오늘 먹은 식단 공유해요!' },
  { id: 3, title: '다이어트 3일차 후기' },
  { id: 4, title: '운동 루틴 추천해주세요' },
  { id: 5, title: '단백질 보충제 어떤게 좋나요?' },
  { id: 6, title: '바디프로필 준비 시작!' },
  { id: 7, title: '치팅데이 메뉴 추천' },
  { id: 8, title: '런닝머신 1시간 완료' },
  { id: 9, title: '식단 관리 너무 어렵네요ㅠㅠ' },
  { id: 10, title: '10번째 게시글 달성' },
];

const MyPage = () => {

  const { user } = useAuth();
  const navigate = useNavigate();
  const [clickEdtBtn, setClickEdtBtn] = useState(false); //클릭 버튼 누르면 true -> 수정 필드 활성화되게끔
  const [nickName, setNickName] = useState('');
  const [isDeleting, setIsDeleting] = useState(false); // 회원 탈퇴 진행 상태
  const [deleteReason, setDeleteReason] = useState(''); // 회원 탈퇴 사유 입력값
  
  // 비밀번호 변경 관련 상태
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 내 글 목록 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3; // 한 페이지에 보여줄 글의 수

  // 현재 페이지에 보여줄 글 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = DUMMY_POSTS.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(DUMMY_POSTS.length / postsPerPage);

  const handlePageChange = (pageNumber) => { // 페이지 이동 로직
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const editProfile = () => { //저장 버튼 클릭 시 로직
    if (!nickName.trim()) {
      alert("변경할 닉네임을 입력해 주세요.");
      return;
    }

    alert("프로필 수정 함수 실행")

    console.log("저장될 닉네임:", nickName);

    //api 받아서 여기서 수정처리하고, 저장버튼 누르면 (clickEdtBtn 이 flase로 바뀌면) api에 저장처리하기
    setClickEdtBtn(false); // 저장 완료 후 수정창 닫기
  }

  const cancelEdit = () => { //취소 버튼 클릭 시 로직
    setNickName(''); // 입력하던 닉네임 비우기 (초기화)
    setClickEdtBtn(false); // 수정창 닫기
  }

  const changePassword = () => { // 비밀번호 변경 로직
    const DUMMY_CURRENT_PW = "1234"; // 임시 현재 비밀번호 (나중에 서버에서 가져온 값으로 대체)

    if (!currentPasswordInput || !newPassword || !confirmPassword) {
      alert("모든 비밀번호 필드를 입력해 주세요.");
      return;
    }

    if (currentPasswordInput !== DUMMY_CURRENT_PW) {
      alert("현재 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("변경할 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    //api 넣어주기
    alert("비밀번호가 성공적으로 변경되었습니다.");
    cancelPasswordEdit(); // 성공 시 인풋 창 초기화 및 닫기
  }

  const cancelPasswordEdit = () => { // 비밀번호 변경 취소
    setIsEditingPassword(false);
    setCurrentPasswordInput('');
    setNewPassword('');
    setConfirmPassword('');
  }

  const delAccount = () =>{ //회원 탈퇴
    if (!deleteReason.trim()) {
      alert('탈퇴 사유를 입력해 주세요.');
      return;
    }
    alert(`회원 탈퇴가 접수되었습니다.\n입력하신 사유: ${deleteReason} 잘가게`);
    
    // TODO: 서버 API 호출하여 탈퇴 처리
    
    setIsDeleting(false); // 탈퇴 처리 후 창 닫기
    setDeleteReason(''); // 사유 초기화
  }

  const cancelDelete = () => { // 탈퇴 취소 로직
    setIsDeleting(false);
    setDeleteReason('');
  }

  return (
    <div className="p-8 my-page-container mb-5 pb-5">
      <h2 className="mb-4" style={{fontSize:'22px', fontWeight:'700', color:'textDark', marginBottom:'4px'}}>마이페이지</h2>

      <CCard>
        {/* <CCardHeader>사용자 정보</CCardHeader> */}
        <CCardBody className='d-flex align-items-center'>
            <div
              className="text-decoration-none"
              style={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #d4e8db, #6aab81)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 700,
                color: '#3d6b4f',
                flexShrink: 0,
                border: 'none',
              }}
            >
              {user?.nickname ? user.nickname[0] : 'U'}
            </div>
            <div className="ms-4 d-flex flex-column">
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                {user?.nickname || '사용자 이름'}
              </div>
              <div className="text-secondary mt-1">
                {user?.email || '사용자 이메일'}
              </div>
            </div>
        </CCardBody>
      </CCard>

      <CRow className="mt-2 g-3">
        <CCol xs={12} md={6} lg={6}>
          <CCard className="h-100">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              회원정보
              {clickEdtBtn?
              ""
              :<CButton //false
                onClick={() => {
                  setClickEdtBtn(!clickEdtBtn);
                  if (!clickEdtBtn) setNickName(user?.nickname || ''); // 수정창 열릴 때 기존 닉네임 미리 채우기
                  cancelPasswordEdit(); // 다른 창 닫기 및 초기화
                  cancelDelete();
                }}
                size="sm" 
                className="rounded-pill button-muted-outline">수정</CButton>}
              
            </CCardHeader>
            <CCardBody>
              <div className="d-flex justify-content-between">
                <span className='text-muted'>닉네임</span>
                <span>{user?.nickname}</span>
                
              </div>

              <hr/>

              <div className="d-flex justify-content-between">
                <span className='text-muted'>이메일</span>
                <span>{user?.email}</span>
              </div>

              {clickEdtBtn?
                <div style={{margin: '1.5rem 0 0 0'}}>
                  <CFormInput 
                    onChange={(e) => setNickName(e.target.value)}
                    value={nickName}
                    placeholder='변경할 닉네임 입력'
                    style={{margin: '0 0 1rem 0'}}
                    ></CFormInput>
                  <CButton //저장
                    onClick={editProfile}
                    className="rounded-pill button-green"
                    style={{marginRight:'10px'}}>저장
                </CButton>
                <CButton //취소 -> 모든 작성 취소하고 원래로 롤백
                  onClick={cancelEdit}
                  className="rounded-pill button button-muted-outline">취소
                </CButton>
                </div>
                :
                <div></div>
              }
              </CCardBody>
            </CCard>
        </CCol>
        <CCol xs={12} md={6} lg={6}>
          <CCard className="h-100 d-flex flex-column">
            <CCardHeader>내 글</CCardHeader>
            <CCardBody className="d-flex flex-column justify-content-between pb-3">
              <div className="w-100">
                {currentPosts.length > 0 ? (
                  <ul className="list-unstyled mb-1 w-100">
                    {currentPosts.map((post) => (
                      <li key={post.id} className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                        <span 
                          className="text-truncate" 
                          style={{ maxWidth: '65%', fontSize: '0.95rem', cursor: 'pointer' }} 
                          title={post.title}
                          onClick={() => navigate(`/post/${post.id}`)}
                        >
                          {post.title}
                        </span>
                        <div className="d-flex gap-1 flex-shrink-0">
                          <CButton size="sm" color="secondary" variant="outline" className="rounded-pill button-muted-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => navigate(`/post/edit/${post.id}`)}>수정</CButton>
                          <CButton size="sm" color="danger" variant="outline" className="rounded-pill button-red-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => { if(window.confirm('삭제하시겠습니까?')) alert(`${post.id}번 글 삭제완료`); }}>삭제</CButton>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center text-muted my-4">작성한 글이 없습니다.</div>
                )}
              </div>
              {totalPages > 0 && ( // 작성한 글이 1개 이상일 때만 페이지네이션 표시
                <CPagination className='justify-content-center mt-auto mb-0'>
                  <CPaginationItem 
                    aria-label="Previous"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    style={{ cursor: currentPage === 1 ? 'default' : 'pointer' }}
                  >
                    <span aria-hidden="true">&laquo;</span>
                  </CPaginationItem>
  
                  {[...Array(totalPages)].map((_, idx) => (
                    <CPaginationItem 
                      key={idx + 1} 
                      active={currentPage === idx + 1}
                      onClick={() => handlePageChange(idx + 1)}
                      style={{ cursor: 'pointer' }}
                    >
                      {idx + 1}
                    </CPaginationItem>
                  ))}
  
                  <CPaginationItem 
                    aria-label="Next"
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    style={{ cursor: currentPage >= totalPages ? 'default' : 'pointer' }}
                  >
                    <span aria-hidden="true">&raquo;</span>
                  </CPaginationItem>
                </CPagination>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="mt-4 mb-5 g-3">
        <CCol xs={12} md={6} lg={6}>
          <CCard className="h-100">
            <CCardHeader>비밀번호 재설정</CCardHeader>
            <CCardBody className="d-flex flex-column justify-content-between align-items-start">   
              {!isEditingPassword ? (
                <>
                  <p className='text-muted'>현재 비밀번호를 확인 후 새 비밀번호로 변경할 수 있습니다</p>
                  <CButton className="rounded-pill button-muted-outline mt-2" onClick={() => {
                    setIsEditingPassword(true);
                    cancelEdit(); // 다른 창 닫기 및 초기화
                    cancelDelete();
                  }}>
                    비밀번호 변경
                  </CButton>
                </>
              ) : (
                <div className="w-100">
                  <CFormInput 
                    type="password"
                    placeholder="현재 비밀번호 입력"
                    value={currentPasswordInput}
                    onChange={(e) => setCurrentPasswordInput(e.target.value)}
                    className="mb-2"
                  />
                  <CFormInput 
                    type="password"
                    placeholder="변경할 새 비밀번호"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mb-2"
                  />
                  <CFormInput 
                    type="password"
                    placeholder="변경할 비밀번호 확인"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mb-3"
                  />
                  <div className="d-flex gap-2">
                    <CButton className="rounded-pill button-green" onClick={changePassword}>변경</CButton>
                    <CButton className="rounded-pill button button-muted  -outline" onClick={cancelPasswordEdit}>
                      취소
                    </CButton>
                  </div>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={6} lg={6}>
            <CCard className="h-100">
              <CCardHeader>회원 탈퇴</CCardHeader>
              <CCardBody className="d-flex flex-column justify-content-between align-items-start">
                {!isDeleting ? (
                  <>
                    <p className='text-muted'>탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다</p>
                    <CButton 
                      color="danger" 
                      className="rounded-pill mt-auto button-red-outline"
                      onClick={() => {
                        setIsDeleting(true);
                        cancelEdit(); // 다른 창 닫기 및 초기화
                        cancelPasswordEdit();
                      }}
                      >회원 탈퇴</CButton>
                  </>
                ) : (
                  <div className="w-100">
                    <CFormInput 
                      placeholder="탈퇴 사유를 입력해 주세요"
                      value={deleteReason}
                      onChange={(e) => setDeleteReason(e.target.value)}
                      className="mb-2"
                    />
                    <div style={{ color: 'red', fontSize: '0.8rem', marginBottom: '1rem' }}>
                      * 탈퇴 후 데이터는 복구되지 않습니다
                    </div>
                    <div className="d-flex gap-2">
                      <CButton className="rounded-pill button button-red-outline" onClick={delAccount}>
                        탈퇴하기
                      </CButton>
                      <CButton className="rounded-pill button button-muted-outline" onClick={cancelDelete}>
                        취소
                      </CButton>
                    </div>
                  </div>
                )}
              </CCardBody>
            </CCard>
        </CCol>
      </CRow>
    
    </div>
  );
};

export default MyPage;