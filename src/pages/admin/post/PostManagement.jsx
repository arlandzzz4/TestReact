import React from 'react'
import AdminTitle from '../common/AdminTitle'
import PostBoard from './PostBoard'

  const PostManagement = () => {
  return (
    <>
    <AdminTitle title="게시글 관리" description="최신순 정렬 | 제목으로 검색" />
    <PostBoard/>
    </>
  )
}

export default PostManagement 