'use client';

import { createPortal } from 'react-dom';
import { useSlideSheet } from '../hooks/useSlideSheet.hook';
import styles from './NumericKeyboard.module.css';

type NumericKeyboardProps = {
  open: boolean;
  /** What is being typed, e.g. "Precio" — shown above the value. */
  label: string;
  /** Already formatted value to show while typing ("6,50", "10:00"). */
  displayValue: string;
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onDone: () => void;
};

const KEYS = ['7', '8', '9', '4', '5', '6', '1', '2', '3', 'backspace', '0', 'done'] as const;

/**
 * Phone-style numpad panel (workspace UI-UX-RULES "Numeric-only inputs") — ported from
 * redeem-app. Ghost-click safe: the backdrop stays mounted 320ms while closing.
 */
export function NumericKeyboard({ open, label, displayValue, onDigit, onBackspace, onDone }: NumericKeyboardProps) {
  const { mounted, entered, closing } = useSlideSheet(open);
  if (!mounted) return null;

  const handleKey = (key: (typeof KEYS)[number]) => {
    if (key === 'backspace') onBackspace();
    else if (key === 'done') onDone();
    else onDigit(key);
  };

  // Portal to <body> so position:fixed is relative to the screen (see BottomSheet).
  return createPortal(
    <div className={styles.backdrop} onClick={closing ? undefined : onDone}>
      <div className={`${styles.panel} ${entered ? styles.panelOpen : ''}`} onClick={(event) => event.stopPropagation()}>
        <div className={styles.display}>
          <span className={styles.label}>{label}</span>
          <span className={styles.value}>{displayValue || '0'}</span>
        </div>
        <div className={styles.grid}>
          {KEYS.map((key) => (
            <button
              key={key}
              type="button"
              className={key === 'done' ? styles.keyDone : styles.key}
              onClick={() => handleKey(key)}
              aria-label={key === 'backspace' ? 'Borrar' : undefined}
            >
              {key === 'backspace' ? '⌫' : key === 'done' ? 'Listo' : key}
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
