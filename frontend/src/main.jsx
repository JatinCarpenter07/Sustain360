import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.jsx'
import { BrowserRouter, HashRouter } from 'react-router-dom';
 import { AuthProvider } from './AuthContext.jsx';
 import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <Toaster
          position="top-right" // Toasts oopar right mein aayenge
          toastOptions={{
            success: {
              style: {
                background: '#10B981', // Green
                color: 'white',
              },
            },
            error: {
              style: {
                background: '#EF4444', // Red
                color: 'white',
              },
            },
          }}
        />
      <App />
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
