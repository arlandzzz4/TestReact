import React from 'react'
import { CCol, CCard, CCardBody } from '@coreui/react'
import { useReportTotalCountQuery, useReportTodayCountQuery } from '@/hooks/queries/useReportQuery';
 
const DashReportCard = () => {
    const {data: totalCnt} = useReportTotalCountQuery();
    const {data: todayCnt} = useReportTodayCountQuery();
    
    return (
    <>
        <CCol sm={6} lg={3} key='1'>
        <CCard className="border-0 shadow-sm mb-3">
          <CCardBody>
            <div className="text-medium-emphasis small">미처리 신고</div>
            <div className="fs-4 fw-bold my-1">{totalCnt}명</div>
            <div className={`small text-danger`}>오늘 +{todayCnt}명</div>
          </CCardBody>
        </CCard>
      </CCol>
    </>
  )
}

export default DashReportCard