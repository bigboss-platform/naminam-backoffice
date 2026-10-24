'use client';

import { useEffect, useState } from 'react';

/** Countdown for the "too many attempts" lock. Ticks every second and ends by itself. */
export function useLockCountdown() {
  const [lockedUntil, setLockedUntil] = useState(0);
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (lockedUntil === 0) return;
    const timer = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= lockedUntil) setLockedUntil(0);
    }, 1000);
    return () => clearInterval(timer);
  }, [lockedUntil]);

  const secondsLeft = lockedUntil === 0 ? 0 : Math.max(0, Math.ceil((lockedUntil - now) / 1000));

  const startLock = (seconds: number) => {
    const current = Date.now();
    setNow(current);
    setLockedUntil(seconds > 0 ? current + seconds * 1000 : 0);
  };

  return { secondsLeft, startLock };
}
