'use client';

import { useEffect, useEffectEvent, useState } from 'react';
import { checkAdminEmail } from '../actions/auth.action';
import { shouldAutoCheckEmail, withMinDuration } from '../utils/email.util';

export type EmailCheckStatus = 'idle' | 'checking' | 'not-found' | 'error';

/** Pause after the last keystroke before asking the server (the user never presses a button). */
const CHECK_DELAY_MS = 700;

/**
 * Checks the email against the server automatically once it looks complete. Edits cancel
 * any check in flight (the caller resets the status on every change).
 */
export function useEmailCheck(email: string, isEnabled: boolean, onFound: (lockSecondsLeft: number) => void) {
  const [status, setStatus] = useState<EmailCheckStatus>('idle');
  const [retryCount, setRetryCount] = useState(0);
  const shouldCheck = isEnabled && shouldAutoCheckEmail(email);
  const handleFound = useEffectEvent(onFound);

  useEffect(() => {
    if (!shouldCheck) return;
    let isCurrent = true;
    const timer = setTimeout(async () => {
      setStatus('checking');
      const result = await withMinDuration(checkAdminEmail(email));
      if (!isCurrent) return;
      if (!result.ok) return setStatus('error');
      if (!result.data.exists) return setStatus('not-found');
      setStatus('idle');
      handleFound(result.data.lockSecondsLeft);
    }, CHECK_DELAY_MS);
    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [email, shouldCheck, retryCount]);

  return {
    status,
    reset: () => setStatus('idle'),
    retry: () => {
      setStatus('checking');
      setRetryCount((count) => count + 1);
    },
  };
}
