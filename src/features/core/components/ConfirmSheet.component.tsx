'use client';

import { BottomSheet } from './BottomSheet.component';
import forms from './forms.module.css';
import styles from './ConfirmSheet.module.css';

type ConfirmSheetProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  isWorking: boolean;
  error: string;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Confirmation for destructive actions (workspace rule: every delete is confirmed). Cancelar is the safe exit. */
export function ConfirmSheet({ open, title, message, confirmLabel, isWorking, error, onConfirm, onCancel }: ConfirmSheetProps) {
  return (
    <BottomSheet open={open} onClose={onCancel} title={title}>
      <p className={styles.message}>{message}</p>
      {error && <p className={forms.formError}>{error}</p>}
      <div className={styles.actions}>
        <button type="button" className={styles.dangerButton} onClick={onConfirm} disabled={isWorking}>
          {isWorking ? 'Eliminando…' : confirmLabel}
        </button>
        <button type="button" className={forms.secondaryButton} onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </BottomSheet>
  );
}
