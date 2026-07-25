import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";

const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export function useInactivityTimeout(enabled = true) {
  const { user } = useAuth();
  const [isLocked, setIsLocked] = useState(false);
  const timerRef = useRef(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!enabled || !user) return;

    timerRef.current = setTimeout(() => {
      setIsLocked(true);
    }, INACTIVITY_TIMEOUT_MS);
  }, [enabled, user]);

  useEffect(() => {
    if (!enabled || !user) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const events = ["mousemove", "keydown", "mousedown", "touchstart", "scroll"];
    const handleUserActivity = () => {
      if (!isLocked) {
        resetTimer();
      }
    };

    events.forEach((evt) => window.addEventListener(evt, handleUserActivity));
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((evt) => window.removeEventListener(evt, handleUserActivity));
    };
  }, [enabled, user, isLocked, resetTimer]);

  const unlockSession = () => {
    setIsLocked(false);
    resetTimer();
  };

  return { isLocked, unlockSession };
}
