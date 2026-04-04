import React from 'react'
import { CCard, CCardHeader, CCardBody } from '@coreui/react'
import TotalCount from './TotalCount'
import NewUsers from './NewUsers.jsx'
import NewReposrts from './NewReposrts.jsx'
import NewPosts from './NewPosts.jsx'
import AdminTitle from './common/AdminTitle'

const Dashboard = () => {
  return (
    <>
    <AdminTitle title="대시보드" description={`${new Date().toLocaleDateString()} 기준`} />
    <TotalCount />
    <NewUsers />
    <NewReposrts />
    <NewPosts /> 
    </>
  )
}

export default Dashboard