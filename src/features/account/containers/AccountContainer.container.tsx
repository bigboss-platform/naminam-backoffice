'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { logout } from '@/features/auth/actions/auth.action';
import { BottomSheet } from '@/features/core/components/BottomSheet.component';
import { InfoSheet } from '@/features/core/components/InfoSheet.component';
import { PageHeader } from '@/features/core/components/PageHeader.component';
import { SheetActions } from '@/features/core/components/SheetActions.component';
import { ChangePasswordForm } from '../components/ChangePasswordForm.component';
import styles from './AccountContainer.module.css';

const ACCOUNT_INFO = {
  title: 'Cuenta',
  howItWorks: [
    'Aquí ves con qué correo entraste y puedes cambiar tu contraseña.',
    'La sesión dura 7 días en este dispositivo. «Cerrar sesión» la termina de inmediato.',
    'Si fallas la contraseña 5 veces seguidas, el acceso se bloquea 10 minutos por seguridad.',
  ],
  glossary: [{ term: 'Sesión', meaning: 'El tiempo que el panel te recuerda sin pedir la contraseña otra vez.' }],
};

export function AccountContainer({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const signOut = async () => {
    await logout();
    router.replace('/login');
    router.refresh();
  };

  return (
    <div className="page-fade-in">
      <PageHeader title="Cuenta" subtitle="Tu acceso al panel" info={<InfoSheet {...ACCOUNT_INFO} />} />
      <section className={styles.profile}>
        <span className={styles.avatar}>
          <span className="material-symbols-outlined">person</span>
        </span>
        <span>
          <span className={styles.name}>{name}</span>
          <span className={styles.email}>{email}</span>
        </span>
      </section>
      {passwordChanged && <p className={styles.success}>Contraseña actualizada.</p>}
      <div className={styles.actions}>
        <SheetActions
          actions={[
            { id: 'password', icon: 'lock', label: 'Cambiar contraseña', onSelect: () => { setFormKey((key) => key + 1); setPasswordChanged(false); setIsPasswordOpen(true); } },
            { id: 'logout', icon: 'logout', label: 'Cerrar sesión', onSelect: () => void signOut(), isDanger: true },
          ]}
        />
      </div>
      <BottomSheet open={isPasswordOpen} onClose={() => setIsPasswordOpen(false)} title="Cambiar contraseña">
        <ChangePasswordForm key={formKey} onSaved={() => { setIsPasswordOpen(false); setPasswordChanged(true); }} />
      </BottomSheet>
    </div>
  );
}
