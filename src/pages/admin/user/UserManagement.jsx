import React from 'react'
import AdminTitle from '../common/AdminTitle'
import UserBoard from './UserBoard'

  const UserManagement = () => {
  return (
    <>
    <AdminTitle title="회원관리" description="가입 최신순 정렬 | 이메일로 검색" />
    <UserBoard />
    </>
  )
}

export default UserManagement