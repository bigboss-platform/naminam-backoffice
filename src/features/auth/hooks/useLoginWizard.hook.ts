'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuthTransition } from '@/features/core/components/AuthTransition.component';
import { login } from '../actions/auth.action';
import { sanitizeEmailInput, withMinDuration } from '../utils/email.util';
import { useEmailCheck } from './useEmailCheck.hook';
import { useLockCountdown } from './useLockCountdown.hook';

export type LoginStep = 'email' | 'password';

/**
 * One field per step (workspace auth rule): email → password. The email is checked
 * automatically once it looks complete; a found email slides straight to the password.
 * No red errors: suggestions, neutral notices, placeholder animations and a lock countdown.
 */
export function useLoginWizard() {
  const router = useRouter();
  const authTransition = useAuthTransition();
  const [step, setStep] = useState<LoginStep>('email');
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  /** Email already found by the server — after "Volver" it is not re-checked (no auto-bounce). */
  const [confirmedEmail, setConfirmedEmail] = useState('');
  /** 0 = no wrong-password notice. */
  const [attemptsLeft, setAttemptsLeft] = useState(0);
  const [hasServerError, setHasServerError] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const lock = useLockCountdown();

  const showPasswordStep = () => {
    setDirection('forward');
    setStep('password');
  };

  const emailCheck = useEmailCheck(email, step === 'email' && email !== confirmedEmail, (lockSecondsLeft) => {
    setConfirmedEmail(email);
    lock.startLock(lockSecondsLeft);
    showPasswordStep();
  });

  const changeEmail = (raw: string) => {
    emailCheck.reset();
    setEmail(sanitizeEmailInput(raw));
  };

  const changePassword = (value: string) => {
    if (isWorking) return;
    setAttemptsLeft(0);
    setHasServerError(false);
    setPassword(value);
  };

  const submitPassword = async () => {
    if (password === '' || isWorking || lock.secondsLeft > 0) return;
    setIsWorking(true);
    setHasServerError(false);
    const result = await withMinDuration(login(email, password));
    if (!result.ok) {
      setIsWorking(false);
      return setHasServerError(true);
    }
    const outcome = result.data;
    if (outcome.kind === 'signed-in') {
      await authTransition.play(() => {
        router.replace('/productos');
        router.refresh();
      }, '/productos');
      return;
    }
    setIsWorking(false);
    setPassword('');
    if (outcome.kind === 'locked') {
      setAttemptsLeft(0);
      lock.startLock(outcome.lockSecondsLeft);
    } else {
      setAttemptsLeft(outcome.attemptsLeft);
    }
  };

  const back = () => {
    setPassword('');
    setAttemptsLeft(0);
    setHasServerError(false);
    setDirection('backward');
    setStep('email');
  };

  return {
    step,
    direction,
    email,
    changeEmail,
    emailStatus: emailCheck.status,
    retryEmailCheck: emailCheck.retry,
    isEmailConfirmed: email !== '' && email === confirmedEmail,
    continueWithEmail: showPasswordStep,
    password,
    changePassword,
    attemptsLeft,
    hasServerError,
    isWorking,
    lockSecondsLeft: lock.secondsLeft,
    submitPassword,
    back,
  };
}

export type LoginWizardCtx = ReturnType<typeof useLoginWizard>;
