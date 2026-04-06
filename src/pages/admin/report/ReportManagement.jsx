 import React from 'react'
 import AdminTitle from '../common/AdminTitle'
 import ReportBoard from './ReportBoard'
 
 const ReportManagement = () => {
   return (
    <>
     <AdminTitle title="신고 관리" description="접수 최신순" />
     <ReportBoard />
     </>
   )
 }

 
 export default ReportManagement 