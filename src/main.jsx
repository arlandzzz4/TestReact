import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Quill from 'quill';

// CoreUI 및 부트스트랩 스타일 적용
import '@coreui/coreui/dist/css/coreui.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// 가장 많이 쓰이는 'Snow' 테마 스타일. 테마 스티일이 2개 외에 더 있는지 모르겠음.
import 'react-quill/dist/quill.snow.css'; 
//import 'react-quill/dist/quill.bubble.css';

//ReactQuill용 설정 / Vite/Webpack 빌드 환경 대응
window.Quill = Quill;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
