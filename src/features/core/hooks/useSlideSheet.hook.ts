'use client';

import { useEffect, useState } from 'react';

/**
 * Mount/enter/close state machine for anything that slides up from the bottom
 * (ported from redeem-app). Uses the "adjust state during render" pattern instead of
 * an effect that calls setState synchronously (react-hooks/set-state-in-effect).
 * While closing, the backdrop stays mounted `closeDelayMs` to absorb the ghost click
 * mobile browsers synthesize — workspace UI-UX-RULES.md "Ghost-click safety".
 */
export function useSlideSheet(open: boolean, closeDelayMs = 320) {
  const [mounted, setMounted] = useState(open);
  const [entered, setEntered] = useState(false);
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setMounted(true);
      setEntered(false);
    }
  }

  const closing = mounted && !open;

  useEffect(() => {
    if (!open || !mounted) return;
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, [open, mounted]);

  useEffect(() => {
    if (!closing) return;
    const timer = setTimeout(() => setMounted(false), closeDelayMs);
    return () => clearTimeout(timer);
  }, [closing, closeDelayMs]);

  return { mounted, entered: entered && open, closing };
}
