'use client';

import { InfoSheet } from '@/features/core/components/InfoSheet.component';
import { PageHeader } from '@/features/core/components/PageHeader.component';
import { SheetActions } from '@/features/core/components/SheetActions.component';
import { ChangePasswordSheet } from '../components/ChangePasswordSheet.component';
import { useAccountActions } from '../hooks/useAccountActions.hook';
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

/** Mobile "Cuenta" tab. On desktop the same actions live in the top bar dropdown (AccountMenu). */
export function AccountContainer({ name, email }: { name: string; email: string }) {
  const ctx = useAccountActions();

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
      {ctx.passwordChanged && <p className={styles.success}>Contraseña actualizada.</p>}
      <div className={styles.actions}>
        <SheetActions
          actions={[
            { id: 'password', icon: 'lock', label: 'Cambiar contraseña', onSelect: ctx.openPassword },
            { id: 'logout', icon: 'logout', label: 'Cerrar sesión', onSelect: () => void ctx.signOut(), isDanger: true },
          ]}
        />
      </div>
      <ChangePasswordSheet ctx={ctx} />
    </div>
  );
}
