'use client';

import { useState } from 'react';
import forms from '@/features/core/components/forms.module.css';
import type { LoginWizardCtx } from '../hooks/useLoginWizard.hook';
import { EmailDomainPills } from './EmailDomainPills.component';
import styles from './LoginStepInput.module.css';

/** The single input of the current login step + its button(s). Slides horizontally between steps. */
export function LoginStepInput({ ctx }: { ctx: LoginWizardCtx }) {
  const { step, direction, value, setValue, hasValue, error, formatProblem, isWorking, next, back } = ctx;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isEmailStep = step === 'email';
  const problems = [formatProblem, error].filter(Boolean);

  return (
    <div key={step} className={direction === 'forward' ? styles.slideForward : styles.slideBackward}>
      <label className={`${styles.question} font-display`} htmlFor="login-input">
        {isEmailStep ? '¿Cuál es tu correo?' : 'Escribe tu contraseña'}
      </label>
      <div className={styles.inputRow}>
        <input
          id="login-input"
          className={styles.input}
          type={isEmailStep ? 'email' : isPasswordVisible ? 'text' : 'password'}
          inputMode={isEmailStep ? 'email' : undefined}
          autoComplete={isEmailStep ? 'username' : 'current-password'}
          autoCapitalize="none"
          value={value}
          autoFocus
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && next()}
        />
        {!isEmailStep && (
          <button
            type="button"
            className={styles.eyeToggle}
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            aria-label={isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            <span className="material-symbols-outlined">{isPasswordVisible ? 'visibility_off' : 'visibility'}</span>
          </button>
        )}
      </div>
      {isEmailStep && isFocused && <EmailDomainPills value={value} onPick={setValue} />}

      {problems.length > 0 && (
        <ul className={forms.errors} aria-live="polite">
          {problems.map((problem) => (
            <li key={problem} className={forms.error}>
              {problem}
            </li>
          ))}
        </ul>
      )}

      {/* Rendered only when there's something to submit — never a disabled button (workspace rule) */}
      {hasValue && !formatProblem && (
        <button type="button" className={`${forms.primaryButton} ${styles.primary}`} onClick={next}>
          {isWorking ? 'Verificando…' : isEmailStep ? 'Siguiente' : 'Entrar'}
        </button>
      )}
      {!isEmailStep && (
        <button type="button" className={`${forms.secondaryButton} ${styles.secondary}`} onClick={back}>
          Volver
        </button>
      )}
    </div>
  );
}
