// src/hooks/useSessionTracker.ts
import { useEffect, useRef } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

const useSessionTracker = (userId: string | null) => {
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!userId) return;

    startRef.current = Date.now();

    const handleExit = () => {
      const end = Date.now();
      const duration = Math.floor((end - (startRef.current || end)) / 1000);

      
  console.log("Tracking session:", { userId, duration });

      axios.post('http://localhost:5050/user/track-session', {
        userId,
        duration,
      }).catch((err) => {
        console.error('Failed to track session', err);
      });
    };

    window.addEventListener('beforeunload', handleExit);
    return () => {
      handleExit();
      window.removeEventListener('beforeunload', handleExit);
    };
  }, [userId]);
};

export default useSessionTracker;
