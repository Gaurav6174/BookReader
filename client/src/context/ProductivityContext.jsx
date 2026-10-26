import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { productivityApi } from '../api/productivity.js';
import { useAuth } from '../hooks/useAuth.jsx';

const ProductivityContext = createContext(null);

const STORAGE_KEY_DATE = 'book-reader-study-date';
const STORAGE_KEY_TODAY = 'book-reader-study-today';
const STORAGE_KEY_TOTAL = 'book-reader-study-total';

function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

function playZenChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Play a gentle two-tone singing bell chime (D5 -> A5)
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.00, now + 0.12); // A5

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.35, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 2.5);
    osc2.start(now + 0.12);
    osc2.stop(now + 2.5);
  } catch (err) {
    console.warn('Audio chime note:', err);
  }
}

export function ProductivityProvider({ children }) {
  const { isAuthenticated } = useAuth();

  // Modal open/close state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Study time tracking
  const [studySecondsToday, setStudySecondsToday] = useState(() => {
    try {
      const savedDate = localStorage.getItem(STORAGE_KEY_DATE);
      if (savedDate === getTodayString()) {
        return Number(localStorage.getItem(STORAGE_KEY_TODAY)) || 0;
      }
      return 0;
    } catch {
      return 0;
    }
  });

  const [studySecondsTotal, setStudySecondsTotal] = useState(() => {
    try {
      return Number(localStorage.getItem(STORAGE_KEY_TOTAL)) || 0;
    } catch {
      return 0;
    }
  });

  // Timer state
  const [initialDuration, setInitialDuration] = useState(25 * 60); // 25 mins default
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  // Backend stats (words, notes/quotes, books, chapters)
  const [stats, setStats] = useState({
    booksCount: 0,
    chaptersCount: 0,
    wordsCount: 0,
    notesCount: 0,
    recentWords: [],
    recentNotes: [],
  });
  const [loadingStats, setLoadingStats] = useState(false);

  // Fetch stats from API
  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoadingStats(true);
    try {
      const res = await productivityApi.getStats();
      if (res) {
        setStats(res.data || res);
      }
    } catch (err) {
      console.warn('Could not fetch productivity stats:', err.message);
    } finally {
      setLoadingStats(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated, fetchStats]);

  // Sync date rollover
  useEffect(() => {
    const today = getTodayString();
    const savedDate = localStorage.getItem(STORAGE_KEY_DATE);
    if (savedDate !== today) {
      localStorage.setItem(STORAGE_KEY_DATE, today);
      localStorage.setItem(STORAGE_KEY_TODAY, '0');
      setStudySecondsToday(0);
    }
  }, []);

  // Save study time to localStorage
  const addStudySecond = useCallback(() => {
    setStudySecondsToday((prev) => {
      const next = prev + 1;
      localStorage.setItem(STORAGE_KEY_DATE, getTodayString());
      localStorage.setItem(STORAGE_KEY_TODAY, String(next));
      return next;
    });
    setStudySecondsTotal((prev) => {
      const next = prev + 1;
      localStorage.setItem(STORAGE_KEY_TOTAL, String(next));
      return next;
    });
  }, []);

  // Timer interval loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            playZenChime();
            return 0;
          }
          addStudySecond();
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, addStudySecond]);

  const startTimer = useCallback((customSeconds) => {
    if (customSeconds && customSeconds > 0) {
      setInitialDuration(customSeconds);
      setTimeLeft(customSeconds);
    }
    setIsRunning(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resumeTimer = useCallback(() => {
    if (timeLeft > 0) {
      setIsRunning(true);
    }
  }, [timeLeft]);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(initialDuration);
  }, [initialDuration]);

  const setDurationInMinutes = useCallback((mins) => {
    const secs = Math.max(1, Math.min(360, mins)) * 60;
    setIsRunning(false);
    setInitialDuration(secs);
    setTimeLeft(secs);
  }, []);

  // Formatter helpers
  function formatHoursMinutes(totalSecs) {
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  function formatTimeRemaining(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  return (
    <ProductivityContext.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
        openModal: () => {
          setIsModalOpen(true);
          fetchStats();
        },
        closeModal: () => setIsModalOpen(false),
        studySecondsToday,
        studySecondsTotal,
        formatHoursMinutes,
        formatTimeRemaining,
        // Timer
        isRunning,
        timeLeft,
        initialDuration,
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
        setDurationInMinutes,
        // Stats
        stats,
        loadingStats,
        fetchStats,
      }}
    >
      {children}
    </ProductivityContext.Provider>
  );
}

export function useProductivity() {
  const ctx = useContext(ProductivityContext);
  if (!ctx) {
    throw new Error('useProductivity must be used within a ProductivityProvider');
  }
  return ctx;
}
