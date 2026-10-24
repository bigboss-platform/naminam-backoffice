'use client';

import { useState } from 'react';
import forms from '@/features/core/components/forms.module.css';
import type { LoginWizardCtx } from '../hooks/useLoginWizard.hook';
import { SUPPORT_ERROR } from '../types/Login.type';
import { extractEmailFromPaste } from '../utils/email.util';
import { EmailSuggestionPills } from './EmailSuggestionPills.component';
import { LoginAnimation } from './LoginAnimation.component';
import styles from './LoginStepInput.module.css';

/**
 * Login step 1. No "Siguiente": the email is checked by itself once it looks complete and a
 * found email slides to the password. Only after "Volver" is there a "Continuar" button.
 */
export function EmailStep({ ctx }: { ctx: LoginWizardCtx }) {
  const { email, changeEmail, emailStatus, retryEmailCheck, isEmailConfirmed, continueWithEmail } = ctx;
  // Starts true: autoFocus focuses the input on mount without firing onFocus.
  const [isFocused, setIsFocused] = useState(true);

  return (
    <>
      <label className={`${styles.question} font-display`} htmlFor="login-email">
        ¿Cuál es tu correo?
      </label>
      <div className={`${styles.inputRow} ${emailStatus === 'checking' ? styles.inputRowBusy : ''}`} aria-busy={emailStatus === 'checking'}>
        <input
          readOnly={emailStatus === 'checking'}
          id="login-email"
          className={styles.input}
          type="email"
          inputMode="email"
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          value={email}
          autoFocus
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(event) => changeEmail(event.target.value)}
          onPaste={(event) => {
            event.preventDefault();
            if (emailStatus !== 'checking') changeEmail(extractEmailFromPaste(event.clipboardData.getData('text')));
          }}
          onKeyDown={(event) => event.key === 'Enter' && isEmailConfirmed && continueWithEmail()}
        />
      </div>
      {isFocused && <EmailSuggestionPills value={email} onPick={changeEmail} />}

      {emailStatus === 'not-found' && (
        <LoginAnimation name="email-not-found" caption="No encontramos una cuenta con este correo" />
      )}
      {emailStatus === 'error' && (
        <>
          <LoginAnimation name="server-error" caption={SUPPORT_ERROR} />
          <button type="button" className={`${forms.secondaryButton} ${styles.primary} ${styles.secondaryFill}`} onClick={retryEmailCheck}>
            Reintentar
          </button>
        </>
      )}
      {isEmailConfirmed && (
        <button type="button" className={`${forms.primaryButton} ${styles.primary}`} onClick={continueWithEmail}>
          Continuar
        </button>
      )}
    </>
  );
}
