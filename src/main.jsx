import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
    <Toaster 
      position="top-right"
      richColors
      closeButton
      duration={4000}
      className="sonner-toast"
    />
  </BrowserRouter>
)