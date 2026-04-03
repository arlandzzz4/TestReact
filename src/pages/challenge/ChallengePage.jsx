import React from 'react';
import { useState } from 'react';
import { 
  CButton, 
  CFormInput, 
  CModal, 
  CModalHeader, 
  CModalTitle, 
  CModalBody, 
  CModalFooter,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CBadge
} from '@coreui/react';
import '../../scss/Challenge.scss'; // SCSS 파일 import
import '../../scss/style.scss'
import ChallengeCard from './ChallengeCard'; // 챌린지 카드 컴포넌트 import

const ChallengePage = () => {

  const [visible, setVisible] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [title, setTitle] = useState(''); //챌린지 이름 저장
  const [description, setDescription] = useState(''); //챌린지 설명 저장
  const [challenges, setChallenges] = useState([]); // 생성된 챌린지 목록을 저장할 배열

  // 목표 일 수 계산 (시작일과 종료일이 모두 선택되었을 때)
  let duration = 0;
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // 당일을 포함하기 위해 +1
  }

  const newChallenge = () => {
    console.log('새 챌린지 넣기');
    setVisible(true);
  }

  // 챌린지 삭제 함수
  const handleDeleteChallenge = (id) => {
    setChallenges(prev => prev.filter(challenge => challenge.id !== id));
  }

  // 추가하기 버튼을 눌렀을 때 실행디는 함수
  const handleAddChallenge = () => {

    if(duration <= 0){
      alert('종료일은 시작일과 같거나 그 이후여야 합니다.');
      return;
    }
    if(!title || !description || !startDate || !endDate){
      alert('모든 항목을 입력해주세요');
      return;
    }

    // 최대 목표 일수 제한
    if(duration > 365) {
      alert('챌린지는 최대 365일까지만 설정할 수 있습니다.');
      return;
    }

    // 현재날짜보다 이전날짜 선택 제한
    if(startDate < new Date().toISOString().split('T')[0]){
      alert('시작일은 현재날짜와 같거나 그 이후여야 합니다.');
      return;
    }

    // 1. 현재 state에 저장된 값들을 모아서 하나의 객체로 (백엔드 전송용)
    const newChallengeData = {
      id: Date.now(), // 맵핑할 때 사용할 고유 키값 임시 생성
      title,
      description,
      startDate,
      endDate,
      duration
    };
    
    // 2. 여기서 백엔드 API 호출
    console.log('새로 추가될 챌린지 데이터:', newChallengeData);

    // 3. 기존 챌린지 배열에 새 데이터를 추가
    setChallenges((prev) => [...prev, newChallengeData]);

    // 4. 모달 닫음 & 입력창 초기화.
    setTitle('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setVisible(false);
  }


//   .map-hero {
//   margin-bottom: 1.5rem;

//   h2 {
//     font-size: 22px;
//     font-weight: 700;
//     color: $text-dark;
//     margin-bottom: 4px;
//   }

//   p {
//     font-size: 14px;
//     color: $text-muted;
//     margin: 0;
//   }
// }

  return (
    <div className="p-8" style={{padding: '2rem 2.5rem 3rem'}}>
      <div class="d-flex justify-content-between align-items-center">
        <h2 style={{fontSize:'22px', fontWeight:'700', color:'textDark', marginBottom:'4px'}}>도전! 1인 챌린지</h2>
        <CButton onClick={newChallenge} className='form-submit-btn'>+ 추가</CButton>
      </div>
      <p className="text-muted" style={{fontSize:'14px', margin:'0'}}>나만의 목표를 세우고 꾸준히 기록해보세요</p>
      <hr />

      {/* ── 생성된 챌린지 카드 목록 ── */}
      <CRow className="mt-4 g-4">
        {
          challenges.length === 0 ? 
          (<div className="w-100 d-flex justify-content-center align-items-center" style={{minHeight:'150px'}}>
              <p className="text-muted m-0">추가하기 버튼을 눌러 챌린지를 만들어보세요</p>
            </div>):
          challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} onDelete={handleDeleteChallenge} />
        ))}
      </CRow>

      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle style={{fontWeight:'bold'}}>새 챌린지 만들기</CModalTitle>
        </CModalHeader>
        
        <CModalBody>
          <p>챌린지 이름</p>
          <CFormInput 
            className="mb-3" 
            placeholder='예: 하루 만 보 챌린지'
            value={title}
            maxLength={20}
            onChange={(e) => setTitle(e.target.value)}
          />
          <p>설명</p>
          <CFormInput 
            className="mb-3" 
            placeholder='어떤 챌린지인지 간단하게 적어주세요'
            value={description}
            maxLength={30}
            onChange={(e) => setDescription(e.target.value)}
          />
          <p>시작일</p>
          <CFormInput 
            className="mb-3" 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <p>종료일</p>
          <CFormInput 
            className="mb-3" 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <p style={{fontWeight:'bold'}}>목표 일 수 : {duration > 0 ? `${duration}일` : '-'}</p>
        </CModalBody>
        
        <CModalFooter>
          <CButton className='form-cancel-btn' onClick={() => setVisible(false)}>
            취소
          </CButton>
          <CButton 
            className='form-submit-btn' 
            onClick={handleAddChallenge}>
            추가하기
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default ChallengePage;