import TotalCount from './TotalCount'
import NewUsers from './NewUsers.jsx'
import NewReposrts from './NewReposrts.jsx'
import NewPosts from './NewPosts.jsx'

const Dashboard = () => {

  return (
    <>
    <div className="mb-4">
    <h1 className="display-6 fw-bold text-dark mb-1" 
        style={{ fontSize: 'clamp(20px, 3vw, 26px)' }}>
        대시보드
    </h1>
    <p className="text-medium-emphasis small mb-0">
        {new Date().toLocaleDateString()} 기준
    </p>
    </div>
    <TotalCount />
    <NewUsers />
    <NewReposrts />
    <NewPosts /> 
    </>
  )
}

export default Dashboard