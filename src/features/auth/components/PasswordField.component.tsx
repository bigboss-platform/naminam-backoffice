'use client';

import { useState, type CSSProperties } from 'react';
import rowStyles from './LoginStepInput.module.css';
import styles from './PasswordField.module.css';

/* Ported from axion-bo-nuxt's UiPasswordField (2026-10-23): the eye blinks (icon swaps at the
   midpoint, while it's a hairline) and the characters mask/unmask one by one. The real input
   stays native; a decorative overlay covers it only for the ~300ms of the animation, because a
   native password input can't stagger its own masking. */
const BLINK_DURATION_MS = 260;
const REVEAL_STAGGER_MS = 22;
const REVEAL_CELL_DURATION_MS = 280;
const REVEAL_MAX_STAGGER_INDEX = 14;

type RevealOverlay = { chars: string[]; toText: boolean };
const NO_OVERLAY: RevealOverlay = { chars: [], toText: false };

type PasswordFieldProps = {
  value: string;
  isBusy: boolean;
  onChange: (value: string) => void;
  onPaste: (text: string) => void;
  onEnter: () => void;
};

export function PasswordField({ value, isBusy, onChange, onPaste, onEnter }: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [overlay, setOverlay] = useState<RevealOverlay>(NO_OVERLAY);

  const toggle = () => {
    if (isBlinking || overlay.chars.length > 0) return;
    const toText = !isVisible;
    setIsBlinking(true);
    setTimeout(() => setIsVisible(toText), BLINK_DURATION_MS / 2);
    setTimeout(() => setIsBlinking(false), BLINK_DURATION_MS);

    const chars = Array.from(value);
    if (chars.length === 0) return;
    setOverlay({ chars, toText });
    const staggerSpan = Math.min(chars.length - 1, REVEAL_MAX_STAGGER_INDEX) * REVEAL_STAGGER_MS;
    setTimeout(() => setOverlay(NO_OVERLAY), staggerSpan + REVEAL_CELL_DURATION_MS);
  };

  return (
    <div className={`${rowStyles.inputRow} ${isBusy ? rowStyles.inputRowBusy : ''}`} aria-busy={isBusy}>
      <input
        readOnly={isBusy}
        id="login-password"
        className={rowStyles.input}
        type={isVisible ? 'text' : 'password'}
        autoComplete="current-password"
        autoCapitalize="none"
        value={value}
        autoFocus
        onChange={(event) => onChange(event.target.value)}
        onPaste={(event) => {
          event.preventDefault();
          onPaste(event.clipboardData.getData('text'));
        }}
        onKeyDown={(event) => event.key === 'Enter' && onEnter()}
      />
      {overlay.chars.length > 0 && (
        <div className={styles.reveal} aria-hidden="true">
          {overlay.chars.map((char, index) => (
            <span
              key={index}
              className={`${styles.cell} ${overlay.toText ? styles.cellReveal : styles.cellHide}`}
              style={{ '--cell-delay': `${Math.min(index, REVEAL_MAX_STAGGER_INDEX) * REVEAL_STAGGER_MS}ms` } as CSSProperties}
            >
              <span className={styles.mask}>•</span>
              <span className={styles.char}>{char}</span>
            </span>
          ))}
        </div>
      )}
      <button
        type="button"
        className={`${rowStyles.eyeToggle} ${styles.eyeButton}`}
        onMouseDown={(event) => event.preventDefault()}
        onClick={toggle}
        aria-pressed={isVisible}
        aria-label={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        <span className={`material-symbols-outlined ${styles.eyeIcon} ${isBlinking ? styles.eyeBlink : ''}`}>
          {isVisible ? 'visibility_off' : 'visibility'}
        </span>
      </button>
    </div>
  );
}
