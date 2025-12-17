import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import BreadTimer from './BreadTimer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BreadTimer />
  </StrictMode>,
)
