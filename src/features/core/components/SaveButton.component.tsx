import forms from './forms.module.css';

type SaveButtonProps = {
  /** Only rendered when the form is complete — never a disabled button (workspace rule). */
  isVisible: boolean;
  isSaving: boolean;
  label?: string;
  error: string;
};

export function SaveButton({ isVisible, isSaving, label = 'Guardar', error }: SaveButtonProps) {
  return (
    <>
      {error && <p className={forms.formError}>{error}</p>}
      {isVisible && (
        <button type="submit" className={forms.primaryButton}>
          {isSaving ? 'Guardando…' : label}
        </button>
      )}
    </>
  );
}
