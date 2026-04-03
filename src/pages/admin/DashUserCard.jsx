/**
 * DashUserCard Component
 *
 * 관리자 대시보드의 전체회원 카운팅.
 *
 */
import React from 'react'
import { CCol, CCard, CCardBody } from '@coreui/react'
import { useUserTotalCountQuery, useUserTodayCountQuery } from '@/hooks/queries/useUserQuery';

const DashUserCard = () => {
    const {data: totalCnt} = useUserTotalCountQuery();
    const {data: todayCnt} = useUserTodayCountQuery();
    
    return (
    <>
        <CCol sm={6} lg={3} key='1'>
        <CCard className="border-0 shadow-sm mb-3">
          <CCardBody>
            <div className="text-medium-emphasis small">전체 회원</div>
            <div className="fs-4 fw-bold my-1">{totalCnt}명</div>
            <div className={`small text-success`}>이번 달 +{todayCnt}명</div>
          </CCardBody>
        </CCard>
      </CCol>
    </>
  )
}

export default DashUserCard