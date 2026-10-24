'use client';

import type { LoginWizardCtx } from '../hooks/useLoginWizard.hook';
import { EmailStep } from './EmailStep.component';
import { PasswordStep } from './PasswordStep.component';
import styles from './LoginStepInput.module.css';

/** The current login step. Slides horizontally between steps (workspace wizard rule). */
export function LoginStepInput({ ctx }: { ctx: LoginWizardCtx }) {
  return (
    <div key={ctx.step} className={ctx.direction === 'forward' ? styles.slideForward : styles.slideBackward}>
      {ctx.step === 'email' ? <EmailStep ctx={ctx} /> : <PasswordStep ctx={ctx} />}
    </div>
  );
}
