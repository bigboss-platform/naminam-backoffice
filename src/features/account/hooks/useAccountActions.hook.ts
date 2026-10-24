'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { logout } from '@/features/auth/actions/auth.action';

/** Account actions shared by the Cuenta page (mobile) and the desktop account dropdown. */
export function useAccountActions() {
  const router = useRouter();
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const openPassword = () => {
    setFormKey((key) => key + 1);
    setPasswordChanged(false);
    setIsPasswordOpen(true);
  };

  const signOut = async () => {
    await logout();
    router.replace('/login');
    router.refresh();
  };

  return {
    isPasswordOpen,
    openPassword,
    closePassword: () => setIsPasswordOpen(false),
    formKey,
    passwordChanged,
    onPasswordSaved: () => {
      setIsPasswordOpen(false);
      setPasswordChanged(true);
    },
    signOut,
  };
}

export type AccountActionsCtx = ReturnType<typeof useAccountActions>;
