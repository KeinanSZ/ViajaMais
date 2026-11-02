import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { DesejosProvider } from './contexts/DesejosContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DesejosProvider>
          <App />
        </DesejosProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
