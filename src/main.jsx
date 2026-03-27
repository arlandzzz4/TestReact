import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'

// ✅ 추가
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import DefaultLayout from './layout/DefaultLayout.jsx'

import '@coreui/coreui/dist/css/coreui.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './scss/style.scss' // 커스텀 스타일

// ✅ 추가
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}> {/* 👈 여기 추가 */}
      <Provider store={store}>
        <BrowserRouter>
          <DefaultLayout />
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  </StrictMode>
)