'use client';

import { useState } from 'react';
import forms from '@/features/core/components/forms.module.css';
import styles from './PasswordInput.module.css';

type PasswordInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: 'current-password' | 'new-password';
};

/** Password field with its own eye toggle (workspace rule: independent state per field). */
export function PasswordInput({ id, value, onChange, autoComplete }: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div className={styles.row}>
      <input
        id={id}
        className={`${forms.input} ${styles.input}`}
        type={isVisible ? 'text' : 'password'}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <button
        type="button"
        className={styles.eye}
        onClick={() => setIsVisible((visible) => !visible)}
        aria-label={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        <span className="material-symbols-outlined">{isVisible ? 'visibility_off' : 'visibility'}</span>
      </button>
    </div>
  );
}
