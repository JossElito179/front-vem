import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Toast from './components/Toast.tsx'
import { AuthProvider } from './auth.modul/AuthProvider'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Toast>
          <App />
        </Toast>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)