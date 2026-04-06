// ChallengeCard.jsx
import React from 'react';
import {
    CCol,
    CCard,
    CCardBody,
    CCardTitle,
    CCardText,
    CButton,
    CProgress, CProgressBar,
    CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilX } from '@coreui/icons'
import { useState, useEffect } from 'react';
import { instance } from '@/api/axios';
import { set } from 'react-hook-form';
/**
 * 챌린지 정보를 받아 카드 형태로 표시하는 컴포넌트
 * @param {object} challenge - 챌린지 데이터 객체
 * @param {function} onDelete - 챌린지 삭제 함수
 */
const ChallengeCard = ({ challenge, onDelete }) => {

    const userEmail = "test@test.com"; // 임시 유저 이메일

    // 백엔드에서 전달된 챌린지 객체의 인증 누적 횟수 및 날짜로 초기화(값이 없으면 0, null)
    const [checkCount, setCheckCount] = useState(challenge.achieveCount || 0); 
    const [lastCheckDate, setLastCheckDate] = useState(challenge.lastCheckedDate || null);
    // (1. 최근 인증날짜와 오늘 날짜 비교, 오늘 날짜와 인증날짜가 다르면 버튼 활성화 & 같으면 비활성화 - 인증 완료) -
    // 인증 클릭 -> 함수 실행
    //              checkCount 증가 / duration보다 크게 될 경우 자동으로 막히도록 ㅇㅇ
    //              인증 날짜도 useState함수 써서 클릭한 시기의 현재 날짜로 변경??
    //              날짜 비교 다시 진행해서 버튼 등 변경시키기

    // 시간(시, 분, 초) 단위를 0으로 초기화하여 오직 날짜 기준으로만 계산
    const end = new Date(challenge.endDate);
    end.setHours(0, 0, 0, 0);

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // 백엔드에서 goalDays가 0이나 undefined로 올 경우를 대비해 프론트엔드에서 목표 일수 안전하게 재계산
    const startDay = new Date(challenge.startDate);
    startDay.setHours(0, 0, 0, 0);
    const calculatedGoalDays = Math.round((end.getTime() - startDay.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const targetDays = (challenge.goalDays > 0 ? challenge.goalDays : calculatedGoalDays) || 1;

    const diffTime = end.getTime() - now.getTime();
    const dday = Math.round(diffTime / (1000 * 60 * 60 * 24)); // 깔끔하게 날짜 차이만 계산되도록 ㅇㅇ

    // 오늘 날짜 문자열 구하기 (2026-03-10 형식)
    const todayYear = now.getFullYear();
    const todayMonth = String(now.getMonth() + 1).padStart(2, '0');
    const todayDate = String(now.getDate()).padStart(2, '0');
    const todayStr = `${todayYear}-${todayMonth}-${todayDate}`;
    
    const addCheckCount = async () => {
        // 이미 오늘 인증을 완료했다면 중단
        if (lastCheckDate === todayStr) {
            return;
        }

        try {
            const res = await instance.post(
                `/api/challenge/${challenge.challengeId}/verify`,
                { checkedDate: todayStr },
                { headers: { 'Content-Type': 'application/json' } }
            );
            // 백엔드 응답으로 state 업데이트
            // 백엔드 응답이 다를 수 있으므로 옵셔널 체이닝으로 방어하고, 없을 시 로컬 값으로 +1 처리
            setCheckCount(res.data?.totalAchieveCount !== undefined ? res.data.totalAchieveCount : checkCount + 1);
            setLastCheckDate(res.data?.checkedDate !== undefined ? res.data.checkedDate : todayStr);
        } catch (error) {
            console.error("인증 실패:", error);
            alert(error.response?.data || "인증 처리 중 오류가 발생했습니다.");
        }
    }

    // 오늘 이미 인증을 했는지 여부 확인
    const isCheckedToday = lastCheckDate === todayStr;

    const progressValue = (checkCount / targetDays) * 100; //프로그래스바 값. (인증 횟수/목표일수) * 100 해줌

    // 챌린지 기간 종료 여부 
    // (주의: 종료일 당일(D-day)까지는 인증할 수 있도록 dday < 0 으로 설정했습니다.)
    const isEnded = dday < 0;

    // 상태에 따른 카드 배경색 결정
    let cardBgColor = '#ffffff'; // 기본 배경색 (진행 중)
    if (progressValue >= 100) {
        cardBgColor = '#F9FCF6'; // 완료 시: 연한 녹색
    } else if (isEnded) {
        cardBgColor = '#F9F8F4'; // 종료 시: 연한 회색
    } else if (isCheckedToday) {
        cardBgColor = '#ffffff'; // 오늘 인증 완료 시: 아주 연한 녹색
    }

    const handleDelete = () => {
        if (window.confirm("챌린지를 삭제하시겠습니까?")) {
            onDelete(challenge.challengeId);
        }
    }

    return (
        <CCol xs={12} md={6} xl={4}>
            <CCard style={{ height: '100%', backgroundColor: cardBgColor, minWidth: 'min(100%, 350px)', borderRadius: '10px', border:'1px solid #D8D5CE', boxShadow: '0 4px 8px rgba(0,0,0,0.05)', transition: 'background-color 0.3s ease'}}>
                <CCardBody style={{ position: 'relative' }}>
                    <CButton 
                        color="transparent" 
                        className="position-absolute top-0 end-0 p-2"
                        onClick={handleDelete}
                    >
                        <CIcon icon={cilX} className="text-secondary" />
                    </CButton>
                    <CCardTitle className="fs-5 fw-bold">{challenge.title}</CCardTitle>
                    
                    <CCardText style={{ fontSize: '0.9rem', color: '#727272' }}>{challenge.description}</CCardText>


                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-baseline">
                            <CCardText className="mb-0" style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#3B5E3B', lineHeight: 1 }}>{checkCount}</CCardText>
                            <CCardText className="mb-0" style={{ fontWeight: 'bold', color: '#727272' }}>일 달성</CCardText>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                            <CCardText className="mb-0" style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#9b5821' }}>D-{dday >= 0? dday : 0}</CCardText>
                            {/* <CCardText className="mb-0" style={{ fontSize: '0.9rem', color: '#727272' }}>목표 {challenge.duration}일</CCardText> */}
                        </div>
                    </div>

                    <CProgress>
                        <CProgressBar
                            value={progressValue}
                            style={{ width: `${progressValue}%`, backgroundColor: '#3B5E3B' }}
                        />
                    </CProgress>

                        <CBadge style={{marginTop:'0.5rem', backgroundColor: '#F0EDE8', color: '#989c8f'}}>
                            {challenge.startDate} ~ {challenge.endDate} · 목표 {targetDays}일
                        </CBadge>
                    <div className="d-flex mt-3 gap-2 align-items-center">
                        <CCardText className="text-muted small mb-0">
                            <span className="text-nowrap">최근 인증 날짜:</span>{' '}
                            <span className="text-nowrap">{lastCheckDate ? lastCheckDate : '없음'}</span>
                        </CCardText>

                        {progressValue >= 100 ?  // 챌린지 100% 달성 시
                            <CButton className="ms-auto flex-shrink-0 text-nowrap" disabled
                                style={{ border: "1px solid #EAF0E5", borderRadius: '40px', color:'#3B5E3B', backgroundColor:'#EAF0E5'}}>완료!
                                </CButton>
                            : isEnded ? // 챌린지 기한이 지났으나 100%를 달성하지 못한 경우
                            <CButton className="ms-auto flex-shrink-0 text-nowrap" disabled
                                style={{ border: "1px solid #c8c8c8", borderRadius: '40px', color:'#fff', background:'#c8c8c8'}}>챌린지 종료
                                </CButton>
                            : isCheckedToday ? // 오늘 인증을 이미 완료한 경우
                            <CButton className="ms-auto flex-shrink-0 text-nowrap" disabled
                                style={{ border: "1px solid #CEDFC6", borderRadius: '40px', color:'#fff', background:'#CEDFC6'}}>오늘 인증 완료
                                </CButton>
                            :  // 아직 오늘 인증을 하지 않은 경우
                            <CButton className="ms-auto flex-shrink-0 text-nowrap" 
                                style={{ border: "1px solid #3B5E3B", borderRadius: '40px', color:'#fff', background:'#3B5E3B'}}
                                onClick={addCheckCount}>인증하기
                                </CButton>}
                    </div>
                    

                </CCardBody>
            </CCard>
        </CCol>
    );
};

export default ChallengeCard;