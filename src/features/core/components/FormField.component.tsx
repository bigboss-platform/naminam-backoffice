import type { ReactNode } from 'react';
import styles from './forms.module.css';

type FormFieldProps = {
  /** Conversational question, e.g. "¿Cómo se llama el producto?" */
  label: string;
  htmlFor?: string;
  isOptional?: boolean;
  /** Specific problem to show under the field (only after the user touched it). */
  error?: string;
  children: ReactNode;
};

/** Label question + control + specific error. No helper text under inputs (workspace rule). */
export function FormField({ label, htmlFor, isOptional = false, error = '', children }: FormFieldProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={htmlFor}>
        {label} {isOptional && <span className={styles.optional}>(opcional)</span>}
      </label>
      {children}
      {error && (
        <ul className={styles.errors} aria-live="polite">
          <li className={styles.error}>{error}</li>
        </ul>
      )}
    </div>
  );
}
