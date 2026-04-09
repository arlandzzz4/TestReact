import React, { useState, useEffect } from 'react';
import { CRow, CCol, CCard, CCardBody, CCardHeader, CCardFooter, CButton, CPagination, CPaginationItem, CFormInput, CForm } from '@coreui/react';
import '../../scss/MyPage.scss'
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { instance } from '@/api/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { useUnsubscribe } from '@/hooks/mutations/useUserMutation';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { auth } from '@/config/firebase';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

// export const pwSchema = z.object({

export const pwSchema = z
  .object({
    currentPassword: z.string().min(1, "현재 비밀번호를 입력해주세요."),
    newPassword: z.string() //새로 입력하는 비번에만 수행
      .min(8, "최소 8자 이상 입력해주세요.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        "대소문자, 숫자, 특수문자를 모두 포함해야 합니다."
      ),
    confirmPassword: z.string()
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"], // 에러 메시지를 어느 필드에 표시할지 지정 (중요!)
  });

const MyPage = () => {

  const { user } = useAuth();
  const navigate = useNavigate();

  const [clickEdtBtn, setClickEdtBtn] = useState(false);
  const [nickName, setNickName] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  // 파이어베이스 키(FCM 토큰) 삭제 및 백엔드 탈퇴 API 처리를 수행하는 커스텀 훅
  const { mutate: withdrawMutate } = useUnsubscribe();

  // 비밀번호 변경 폼 관리를 위한 react-hook-form 추가
  const {
    register: registerPw,
    handleSubmit: handleSubmitPw,
    formState: { errors: pwErrors, isValid: isPwValid },
    reset: resetPw
  } = useForm({
    resolver: zodResolver(pwSchema),
    mode: 'onChange',
  });

  // 내 글 목록 상태
  const [myPosts, setMyPosts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;
  const totalPages = Math.ceil(totalCount / postsPerPage);



  // 보여줄 페이지 번호 계산 (현재 페이지 포함 앞뒤 1개씩, 최대 3개)
  const pageNumbers = (() => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage === 1) return [1, 2, 3];
    if (currentPage === totalPages) return [totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 1, currentPage, currentPage + 1];
  })();

  // 내 글 목록 API 호출
  const fetchMyPosts = async (page) => {
    if (!user?.email) return;
    try {
      const res = await instance.get('/api/post/my', {
        params: {
          userEmail: user.email,
          offset: (page - 1) * postsPerPage,
          size: postsPerPage,
        }
      });
      // 서버 응답이 배열이 아닌 객체로 감싸져 올 경우를 대비한 안전한 처리
      const data = res.data;
      const fetchedPosts = Array.isArray(data) ? data : (data?.content || data?.data || []);
      setMyPosts(fetchedPosts);
      
      // [프론트엔드 안전장치] 1페이지인데 가져온 글이 3개(postsPerPage) 미만이라면,
      // 백엔드의 totalCount API가 잘못된 값을 주더라도 강제로 실제 개수로 맞춰줍니다.
      if (page === 1 && fetchedPosts.length < postsPerPage) {
        setTotalCount(fetchedPosts.length);
      }
    } catch (err) {
      console.error('내 글 목록 조회 실패', err);
    }
  };

  // 총 게시글 수 API 호출
  const fetchTotalCount = async () => {
    if (!user?.email) return;
    try {
      const res = await instance.get('/api/post/my/count', { 
        params: { userEmail: user.email }
      });
      setTotalCount(res.data);
    } catch (err) {
      console.error('총 게시글 수 조회 실패', err);
    }
  };

  // 닉네임 변경 API 호출
  const fetchUpdateNickname = async (newNickname) => {
    if (!user?.email) return;
    try {
      // 스웨거 테스트와 완벽하게 동일한 JSON 객체 형태로 전송합니다.
      await instance.patch('/api/user/me/nickname', { 
        email: user.email,
        nickname: newNickname
      });

      // [프론트엔드 상태 즉시 동기화] 새로고침 시에도 변경된 닉네임이 유지되도록 전역 상태(및 로컬 캐시)를 업데이트합니다.
      useAuthStore.setState((state) => ({
        user: state.user ? { ...state.user, nickname: newNickname } : state.user
      }));

      alert('닉네임이 성공적으로 변경되었습니다.');
      return true; // 성공 여부 반환
    } catch (err) {
      console.error('닉네임 변경 실패', err);
      alert('닉네임 변경에 실패했습니다.');
      return false; // 실패 여부 반환
    }
  };


  useEffect(() => {
    fetchTotalCount();
  }, [user]);

  useEffect(() => {
    fetchMyPosts(currentPage);
  }, [currentPage, user]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const editProfile = async () => {
    if (!nickName.trim()) {
      alert("변경할 닉네임을 입력해 주세요.");
      return;
    }
    const isSuccess = await fetchUpdateNickname(nickName);
    if (isSuccess) {
      setNickName('');
      setClickEdtBtn(false);
    }
  }

  const cancelEdit = () => {
    setNickName('');
    setClickEdtBtn(false);
  }

  const changePassword = async (data) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("로그인 정보가 만료되었습니다. 다시 로그인해 주세요.");
      return;
    }

    // 1. Firebase 재인증 (현재 비밀번호 검증)
    const credential = EmailAuthProvider.credential(currentUser.email, data.currentPassword);
    await reauthenticateWithCredential(currentUser, credential);

    // 2. Firebase 비밀번호 변경
    await updatePassword(currentUser, data.newPassword);

    // 3. 백엔드 DB 동기화
    await instance.patch('/api/user/me/password', {
      email: user?.email,
      newPassword: data.newPassword
    });

    alert("비밀번호가 성공적으로 변경되었습니다.");
    cancelPasswordEdit();

  } catch (error) {
    console.error("비밀번호 변경 실패:", error);
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
      alert("현재 비밀번호가 일치하지 않습니다.");
    } else if (error.code === 'auth/weak-password') {
      alert("비밀번호가 너무 쉽습니다.");
    } else {
      alert("비밀번호 변경 중 오류가 발생했습니다.");
    }
  }
};

  const cancelPasswordEdit = () => {
    setIsEditingPassword(false);
    resetPw();
  }

  const delAccount = () => {
    if (!deleteReason.trim()) {
      alert('탈퇴 사유를 입력해 주세요.');
      return;
    }
    
    if (window.confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      // ✅ 수정된 부분: 백엔드 UnsubscribeRequestDto가 필요로 하는 정보를 모두 보냅니다.
      withdrawMutate({
        email: user?.email,
        providerCode: user?.providerCode || '01', // 일반(LOCAL) 회원의 기본 코드값 (백엔드 설정에 맞춤)
        providerId: user?.providerId || null,     // 소셜 로그인 회원일 경우 존재하는 ID
        reason: deleteReason
      }, {
        onSuccess: () => {
          // useUnsubscribe 훅 내부에 alert 처리가 되어 있으므로, 여기서는 후속 처리만 수행합니다.
          useAuthStore.setState({ user: null, token: null });
          localStorage.removeItem('accessToken');
          navigate('/', { replace: true });
        }
      });
    }
  }

  const cancelDelete = () => {
    setIsDeleting(false);
    setDeleteReason('');
  }

  return (
    <div className="p-8 my-page-container mb-5 pb-5">
      <h2 className="mb-4" style={{fontSize:'22px', fontWeight:'700', color:'textDark', marginBottom:'4px'}}>마이페이지</h2>

      <CCard>
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
              :<CButton
                onClick={() => {
                  setClickEdtBtn(!clickEdtBtn);
                  if (!clickEdtBtn) setNickName(user?.nickname || '');
                  cancelPasswordEdit();
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
                  />
                  <CButton
                    onClick={editProfile}
                    className="rounded-pill button-green"
                    style={{marginRight:'10px'}}>저장
                  </CButton>
                  <CButton
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
                {Array.isArray(myPosts) && myPosts.length > 0 ? (
                  <ul className="list-unstyled mb-1 w-100">
                    {myPosts.map((post) => (
                      <li key={post.postId} className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                        <span 
                          className="text-truncate" 
                          style={{ maxWidth: '65%', fontSize: '0.95rem', cursor: 'pointer' }} 
                          title={post.title}
                          onClick={() => window.open(`/post/${post.postId}`, '_blank')}
                        >
                          {post.title}
                        </span>
                        <div className="d-flex gap-1 flex-shrink-0">
                          <CButton size="sm" color="secondary" variant="outline" className="rounded-pill button-muted-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => navigate(`/post/edit/${post.postId}`)}>수정</CButton>
                          <CButton size="sm" color="danger" variant="outline" className="rounded-pill button-red-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => { if(window.confirm('삭제하시겠습니까?')) alert(`${post.postId}번 글 삭제완료`); }}>삭제</CButton>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center text-muted my-4">작성한 글이 없습니다.</div>
                )}
              </div>
              {totalPages > 0 && (
                <CPagination className='justify-content-center mt-auto mb-0'>
                  <CPaginationItem 
                    aria-label="Previous"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    style={{ cursor: currentPage === 1 ? 'default' : 'pointer' }}
                  >
                    <span aria-hidden="true">&laquo;</span>
                  </CPaginationItem>

                  {pageNumbers[0] > 1 && (
                    <CPaginationItem disabled>
                      <span aria-hidden="true">...</span>
                    </CPaginationItem>
                  )}

                  {pageNumbers.map((page) => (
                    <CPaginationItem 
                      key={page} 
                      active={currentPage === page}
                      onClick={() => handlePageChange(page)}
                      style={{ cursor: 'pointer' }}
                    >
                      {page}
                    </CPaginationItem>
                  ))}

                  {pageNumbers[pageNumbers.length - 1] < totalPages && (
                    <CPaginationItem disabled>
                      <span aria-hidden="true">...</span>
                    </CPaginationItem>
                  )}

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
                  <CButton className="rounded-pill button-muted-outline mt-2" 
                  onClick={() => {
                    // 1. 소셜 로그인 여부 먼저 체크
                    if (user?.providerCode !== "01") {
                      alert("소셜 회원가입 회원은 비밀번호를 재설정할 수 없습니다.");
                      return; // 더 이상 진행하지 않고 종료
                    }

                    // 2. 일반 회원일 경우에만 상태 변경
                    setIsEditingPassword(true);
                    cancelEdit();
                    cancelDelete();
                  }}
                  >
                    비밀번호 변경
                  </CButton>
                </>
              ) : (
              <CForm className="w-100" onSubmit={handleSubmitPw(changePassword)}>
                <div className="mb-2">
                  <CFormInput 
                    type="password"
                    placeholder="현재 비밀번호 입력"
                    {...registerPw('currentPassword')}
                    invalid={!!pwErrors.currentPassword}
                  />
                  {pwErrors.currentPassword && <div className="text-danger mt-1" style={{fontSize: '0.8rem'}}>{pwErrors.currentPassword.message}</div>}
                </div>
                <div className="mb-2">
                  <CFormInput 
                    type="password"
                    placeholder="변경할 새 비밀번호"
                    {...registerPw('newPassword')}
                    invalid={!!pwErrors.newPassword}
                  />
                  {pwErrors.newPassword && <div className="text-danger mt-1" style={{fontSize: '0.8rem'}}>{pwErrors.newPassword.message}</div>}
                </div>
                <div className="mb-3">
                  <CFormInput 
                    type="password"
                    placeholder="변경할 비밀번호 확인"
                    {...registerPw('confirmPassword')}
                    invalid={!!pwErrors.confirmPassword}
                  />
                  {pwErrors.confirmPassword && <div className="text-danger mt-1" style={{fontSize: '0.8rem'}}>{pwErrors.confirmPassword.message}</div>}
                </div>
                <div className="d-flex gap-2">
                  {/* 모든 조건을 통과해야만(!isPwValid) 변경 버튼이 눌리게 잠급니다 */}
                  <CButton type="submit" className="rounded-pill button-green" disabled={!isPwValid}>변경</CButton>
                  <CButton type="button" className="rounded-pill button button-muted-outline" onClick={cancelPasswordEdit}>취소</CButton>
                </div>
              </CForm>
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
                      cancelEdit();
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
                    <CButton className="rounded-pill button button-red-outline" onClick={delAccount}>탈퇴하기</CButton>
                    <CButton className="rounded-pill button button-muted-outline" onClick={cancelDelete}>취소</CButton>
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