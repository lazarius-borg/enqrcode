import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PWAInstallProvider } from './context/PWAInstallContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PWAInstallProvider>
      <App />
    </PWAInstallProvider>
  </StrictMode>,
)
