'use client';

import forms from '@/features/core/components/forms.module.css';
import type { LoginWizardCtx } from '../hooks/useLoginWizard.hook';
import { SUPPORT_ERROR } from '../types/Login.type';
import { extractPasswordFromPaste, formatCountdown } from '../utils/email.util';
import { LoginAnimation } from './LoginAnimation.component';
import { PasswordField } from './PasswordField.component';
import styles from './LoginStepInput.module.css';

/** Login step 2. Locked → countdown instead of the input; wrong password → neutral notice. */
export function PasswordStep({ ctx }: { ctx: LoginWizardCtx }) {
  const { password, changePassword, attemptsLeft, hasServerError, isWorking, lockSecondsLeft, submitPassword, back } = ctx;

  const backButton = (
    <button type="button" className={`${forms.secondaryButton} ${styles.secondary} ${styles.secondaryFill}`} onClick={back}>
      Volver
    </button>
  );

  if (lockSecondsLeft > 0) {
    return (
      <>
        <LoginAnimation name="account-locked" caption="Hubo demasiados intentos con esta contraseña." />
        <div className={styles.countdown} role="timer" aria-live="off">
          <span className={styles.countdownLabel}>Se desbloquea en</span>
          <span className={`${styles.countdownValue} font-display`}>{formatCountdown(lockSecondsLeft)}</span>
        </div>
        {backButton}
      </>
    );
  }

  return (
    <>
      <label className={`${styles.question} font-display`} htmlFor="login-password">
        Escribe tu contraseña
      </label>
      <PasswordField
        value={password}
        isBusy={isWorking}
        onChange={changePassword}
        onPaste={(text) => changePassword(extractPasswordFromPaste(text))}
        onEnter={() => void submitPassword()}
      />

      {attemptsLeft > 0 && (
        <p className={styles.notice} aria-live="polite">
          <span className="material-symbols-outlined" aria-hidden="true">info</span>
          La contraseña no coincide. Te {attemptsLeft === 1 ? 'queda 1 intento' : `quedan ${attemptsLeft} intentos`}.
        </p>
      )}
      {hasServerError && <LoginAnimation name="server-error" caption={SUPPORT_ERROR} />}

      {/* Rendered only when there's something to submit — never a disabled button (workspace rule) */}
      {password !== '' && (
        <button type="button" className={`${forms.primaryButton} ${styles.primary}`} onClick={() => void submitPassword()}>
          {isWorking ? 'Entrando…' : hasServerError ? 'Reintentar' : 'Entrar'}
        </button>
      )}
      {backButton}
    </>
  );
}
