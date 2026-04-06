 import React from 'react'
 import AdminTitle from '../common/AdminTitle'
 import CommentBoard from './CommentBoard'
   const CommentManagement = () => {
   return (
    <>
     <AdminTitle title="댓글 관리" description="작성 최신순 정렬" />
     <CommentBoard/>
     </>
   )
 }
 
 export default CommentManagement 