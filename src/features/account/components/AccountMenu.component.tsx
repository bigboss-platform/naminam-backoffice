'use client';

import { useState } from 'react';
import { DropdownMenu } from '@/features/core/components/DropdownMenu.component';
import { useAccountActions } from '../hooks/useAccountActions.hook';
import { ChangePasswordSheet } from './ChangePasswordSheet.component';
import styles from './AccountMenu.module.css';

/** Desktop top bar: "Cuenta" opens a dropdown with the account options (no page change). */
export function AccountMenu({ name, email }: { name: string; email: string }) {
  const ctx = useAccountActions();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ''}`}
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <span className={styles.avatar} aria-hidden="true">
          <span className="material-symbols-outlined">person</span>
        </span>
        Cuenta
        <span className={`material-symbols-outlined ${styles.chevron}`} aria-hidden="true">chevron_right</span>
      </button>

      <DropdownMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        label="Cuenta"
        header={
          <>
            <div className={styles.profile}>
              <span className={styles.name}>{name}</span>
              <span className={styles.email}>{email}</span>
            </div>
            {ctx.passwordChanged && <p className={styles.success}>Contraseña actualizada.</p>}
          </>
        }
        items={[
          { id: 'password', icon: 'lock', label: 'Cambiar contraseña', onSelect: ctx.openPassword },
          { id: 'logout', icon: 'logout', label: 'Cerrar sesión', onSelect: () => void ctx.signOut(), isDanger: true },
        ]}
      />

      <ChangePasswordSheet ctx={ctx} />
    </div>
  );
}
