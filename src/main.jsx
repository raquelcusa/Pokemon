import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Mockup from './PageMockup/Mockup.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Mockup/>
  </StrictMode>,
)
