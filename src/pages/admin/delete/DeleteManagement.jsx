 import React from 'react'
 import AdminTitle from '../common/AdminTitle'
 import DeleteBoard from './DeleteBoard'
 
   const DeleteManagement = () => {
   return (
    <>
     <AdminTitle title="삭제 관리" description="관리자가 삭제 처리한 게시글 댓글 내역" />
     <DeleteBoard />
     </>
   )
 }
 
 export default DeleteManagement 