
import DashUserCard from './DashUserCard'
import DashPostCard from './DashPostCard'
import DashCommentCard from './DashCommentCard'
import DashReportCard from './DashReportCard'

const TotalCount = () => {

  return (
    <div className="mb-4">
      <CRow className="g-3">
        <CCol
          key={post.id}
          xs={12}
          sm={6}
          md={6}
          lg={4}
          xl={3}
        >
          <DashUserCard/>
        </CCol>
        <CCol
          key={post.id}
          xs={12}
          sm={6}
          md={6}
          lg={4}
          xl={3}
        >
          <DashPostCard/>
        </CCol>
        <CCol
          key={post.id}
          xs={12}
          sm={6}
          md={6}
          lg={4}
          xl={3}
        >
          <DashCommentCard/>
        </CCol>
        <CCol
          key={post.id}
          xs={12}
          sm={6}
          md={6}
          lg={4}
          xl={3}
        >
          <DashReportCard/>
        </CCol>
        </CRow>
    </div>
  )
}

export default TotalCount