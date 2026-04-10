import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4" style={{backgroundColor:'#F0EDE8'}}>
     <div >
      <span>Information Of Balance</span>
      <span className="ms-1">&copy; 2026 Team IoB</span>
    </div>

    <div className="ms-auto">
      <a href="https://github.com/arlandzzz4">GitHub</a>
      <span className="mx-2">|</span>
      <span>v1.0.0</span>
    </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
