'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useSlideSheet } from '../hooks/useSlideSheet.hook';
import styles from './BottomSheet.module.css';

/** Sheet slides in over 250ms; content fades in 10ms after it lands (UI-UX-RULES "sheet content reveal"). */
const CONTENT_REVEAL_DELAY_MS = 260;

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Optional second line under the title (e.g. the product name being edited). */
  subtitle?: string;
  /** Optional media (e.g. a big product photo) shown first, above the title. */
  media?: ReactNode;
  /** Desktop modal width: "wide" for two-column forms (e.g. dessert form + live preview). */
  size?: 'normal' | 'wide';
  children: ReactNode;
};

/** iOS-style bottom drawer with a title: backdrop tap or Escape closes it (workspace rule: no close/X button). */
export function BottomSheet({ open, onClose, title, subtitle = '', media, size = 'normal', children }: BottomSheetProps) {
  const { mounted, entered, closing } = useSlideSheet(open);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (!entered) return;
    const timer = setTimeout(() => setIsRevealed(true), CONTENT_REVEAL_DELAY_MS);
    return () => {
      clearTimeout(timer);
      setIsRevealed(false);
    };
  }, [entered]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!mounted) return null;

  // Portal to <body>: a transformed ancestor (e.g. .page-fade-in) would otherwise pin
  // position:fixed to the page instead of the screen.
  return createPortal(
    <div
      className={`${styles.backdrop} ${entered ? styles.backdropVisible : ''}`}
      onClick={closing ? undefined : onClose}
    >
      <div
        className={`${styles.sheet} ${size === 'wide' ? styles.sheetWide : ''} ${entered ? styles.sheetOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <span className={styles.grabber} aria-hidden="true" />
        <div className={`${styles.content} ${isRevealed ? styles.contentRevealed : ''}`}>
          {media}
          <header className={styles.header}>
            <h2 className={`${styles.title} font-display`}>{title}</h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </header>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
