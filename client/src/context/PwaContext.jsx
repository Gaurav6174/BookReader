import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const PwaContext = createContext(null);

export function PwaProvider({ children }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already running standalone
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    setIsStandalone(isStandaloneMode);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Listen for beforeinstallprompt (Chrome, Edge, Android)
    function handleBeforeInstallPrompt(e) {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('[PWA] beforeinstallprompt event captured');
    }

    // Listen for appinstalled
    function handleAppInstalled() {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setIsStandalone(true);
      setShowGuide(false);
      console.log('[PWA] App successfully installed!');
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = useCallback(async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        console.log('[PWA] User choice:', choice.outcome);
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
          setIsStandalone(true);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.warn('[PWA] Installation prompt error:', err);
      }
    } else {
      setShowGuide(true);
    }
  }, [deferredPrompt]);

  // Available to install as long as it's not already in standalone mode
  const canInstall = !isStandalone;

  return (
    <PwaContext.Provider
      value={{
        canInstall,
        isStandalone,
        isInstalled,
        isIos,
        showGuide,
        setShowGuide,
        installApp,
      }}
    >
      {children}
    </PwaContext.Provider>
  );
}

export function usePwa() {
  const ctx = useContext(PwaContext);
  if (!ctx) {
    throw new Error('usePwa must be used within a PwaProvider');
  }
  return ctx;
}
