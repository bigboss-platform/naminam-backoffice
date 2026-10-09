'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { checkAdminEmail, login } from '../actions/auth.action';

export type LoginStep = 'email' | 'password';

const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * One field per step (workspace auth rule): email → password. The email is checked only
 * when "Siguiente" is pressed (never while typing); errors are specific.
 */
export function useLoginWizard() {
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>('email');
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isWorking, setIsWorking] = useState(false);

  const value = step === 'email' ? email : password;
  const hasValue = value.trim() !== '';
  const formatProblem = step === 'email' && email !== '' && !EMAIL_FORMAT.test(email.trim()) ? 'Revisa el formato del correo (ej. nombre@gmail.com)' : '';

  const setValue = (nextValue: string) => {
    setError('');
    if (step === 'email') setEmail(nextValue);
    else setPassword(nextValue);
  };

  const submitEmail = async () => {
    if (formatProblem) return;
    setIsWorking(true);
    const result = await checkAdminEmail(email);
    setIsWorking(false);
    if (!result.ok) return setError(result.error);
    setDirection('forward');
    setStep('password');
  };

  const submitPassword = async () => {
    setIsWorking(true);
    const result = await login(email, password);
    if (!result.ok) {
      setIsWorking(false);
      return setError(result.error);
    }
    router.replace('/productos');
    router.refresh();
  };

  const next = () => {
    if (!hasValue || isWorking) return;
    if (step === 'email') void submitEmail();
    else void submitPassword();
  };

  const back = () => {
    setError('');
    setPassword('');
    setDirection('backward');
    setStep('email');
  };

  return { step, direction, value, setValue, hasValue, error, formatProblem, isWorking, next, back };
}

export type LoginWizardCtx = ReturnType<typeof useLoginWizard>;
