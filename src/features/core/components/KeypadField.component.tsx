'use client';

import { useState } from 'react';
import { NumericKeyboard } from './NumericKeyboard.component';
import styles from './forms.module.css';

type KeypadFieldProps = {
  id: string;
  /** Raw digits typed so far ("650", "1000", "584126722218"). */
  digits: string;
  onChange: (digits: string) => void;
  maxDigits: number;
  /** Digits → what the user sees ("6,50", "10:00", "+58 412…"). */
  formatDisplay: (digits: string) => string;
  /** Shown above the value inside the keypad. */
  keyboardLabel: string;
  prefix?: string;
  placeholder: string;
  /** Called when the keypad closes (to mark the field as touched). */
  onDone?: () => void;
  /** Money: '0650' → '650'. Times/phones keep leading zeros ('0930' → 09:30). */
  stripLeadingZeros?: boolean;
};

/**
 * Digits-only input: a styled display + the custom NumericKeyboard — never a native
 * <input type="number"> (workspace rule: no selection handles, loupe or autocorrect on iOS).
 */
export function KeypadField(props: KeypadFieldProps) {
  const { id, digits, onChange, maxDigits, formatDisplay, keyboardLabel, prefix = '', placeholder, onDone, stripLeadingZeros = false } = props;
  const [isOpen, setIsOpen] = useState(false);
  const display = digits ? formatDisplay(digits) : '';

  const closeKeyboard = () => {
    setIsOpen(false);
    onDone?.();
  };

  return (
    <>
      <button
        id={id}
        type="button"
        className={`${styles.display} ${isOpen ? styles.displayActive : ''}`}
        onClick={() => setIsOpen(true)}
      >
        {prefix && <span className={styles.displayPrefix}>{prefix}</span>}
        {display ? (
          <span className={styles.displayValue}>{display}</span>
        ) : (
          <span className={styles.displayPlaceholder}>{placeholder}</span>
        )}
        {isOpen && <span className={styles.cursor} aria-hidden="true" />}
      </button>
      <NumericKeyboard
        open={isOpen}
        label={keyboardLabel}
        displayValue={prefix && display ? `${prefix} ${display}` : display}
        onDigit={(digit) => {
          const typed = `${digits}${digit}`;
          const next = stripLeadingZeros ? typed.replace(/^0+(?=\d)/, '') : typed;
          if (next.length <= maxDigits) onChange(next);
        }}
        onBackspace={() => onChange(digits.slice(0, -1))}
        onDone={closeKeyboard}
      />
    </>
  );
}
