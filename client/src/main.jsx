import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ToastProvider } from './hooks/useToast.jsx';
import { ThemeProvider } from './hooks/useTheme.jsx';
import { AuthProvider } from './hooks/useAuth.jsx';
import { PwaProvider } from './context/PwaContext.jsx';
import InstallGuideModal from './components/pwa/InstallGuideModal.jsx';

// Register Service Worker for PWA direct installation
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('[PWA] Service Worker registered scope:', reg.scope);
      })
      .catch((err) => {
        console.warn('[PWA] Service Worker registration failed:', err);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <PwaProvider>
            <App />
            <InstallGuideModal />
          </PwaProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
