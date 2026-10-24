'use client';

import { BrandLogo } from '@/features/core/components/BrandLogo.component';
import { LoginStepInput } from '../components/LoginStepInput.component';
import { useLoginWizard } from '../hooks/useLoginWizard.hook';
import styles from './LoginContainer.module.css';

type LoginContainerProps = {
  /** DEMO MODE only: the demo account, shown so the client can try the panel. */
  demoLogin: { email: string; password: string } | null;
};

export function LoginContainer({ demoLogin }: LoginContainerProps) {
  const ctx = useLoginWizard();
  return (
    <main className={`${styles.page} page-fade-in`}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <BrandLogo height={72} priority />
          <span className={styles.badge}>Administración</span>
        </div>
        {/* Step indicator: dots only (workspace rule — never "1 de 2") */}
        <div className={styles.dots} aria-hidden="true">
          <span className={`${styles.dot} ${styles.dotActive}`} />
          <span className={`${styles.dot} ${ctx.step === 'password' ? styles.dotActive : ''}`} />
        </div>
        <LoginStepInput ctx={ctx} />
        {demoLogin && (
          <p className={styles.demo}>
            <strong>Modo demostración</strong>
            Correo: {demoLogin.email}
            <br />
            Contraseña: {demoLogin.password}
          </p>
        )}
      </div>
    </main>
  );
}
