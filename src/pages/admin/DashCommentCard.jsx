import React from 'react'
import { CRow, CCol, CCard, CCardBody } from '@coreui/react'
import { useCommentTotalCountQuery, useCommentTodayCountQuery } from '@/hooks/queries/usePostQuery';

const DashCommentCard = () => {
    const {data: totalCnt} = useCommentTotalCountQuery();
    const {data: todayCnt} = useCommentTodayCountQuery();
    
    return (
    <>
        <CCol sm={6} lg={3} key='1'>
        <CCard className="border-0 shadow-sm mb-3">
          <CCardBody>
            <div className="text-medium-emphasis small">전체 댓글</div>
            <div className="fs-4 fw-bold my-1">{totalCnt}건</div>
            <div className={`small text-success`}>오늘 +{todayCnt}건</div>
          </CCardBody>
        </CCard>
      </CCol>
    </>
  )
}

export default DashCommentCard