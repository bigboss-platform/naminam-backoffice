'use client';

import { useState } from 'react';
import { FormField } from '@/features/core/components/FormField.component';
import forms from '@/features/core/components/forms.module.css';
import { SaveButton } from '@/features/core/components/SaveButton.component';
import { changePassword } from '../actions/account.action';
import { isStrongPassword, PASSWORD_RULES } from '../utils/password.rules';
import { PasswordInput } from './PasswordInput.component';

/** Current + new password, with the live rule list under the new one (workspace rule). */
export function ChangePasswordForm({ onSaved }: { onSaved: () => void }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const isComplete = currentPassword !== '' && isStrongPassword(newPassword);

  const save = async () => {
    if (!isComplete || isSaving) return;
    setIsSaving(true);
    const result = await changePassword(currentPassword, newPassword);
    setIsSaving(false);
    if (!result.ok) return setSaveError(result.error);
    onSaved();
  };

  return (
    <form className={forms.form} onSubmit={(event) => { event.preventDefault(); void save(); }}>
      <FormField label="¿Cuál es tu contraseña actual?" htmlFor="password-current">
        <PasswordInput id="password-current" value={currentPassword} onChange={(value) => { setSaveError(''); setCurrentPassword(value); }} autoComplete="current-password" />
      </FormField>
      <FormField label="¿Cuál será la nueva contraseña?" htmlFor="password-new">
        <PasswordInput id="password-new" value={newPassword} onChange={(value) => { setSaveError(''); setNewPassword(value); }} autoComplete="new-password" />
        {newPassword && (
          <ul className={forms.errors} aria-live="polite">
            {PASSWORD_RULES.map((rule) => (
              <li key={rule.id} className={rule.test(newPassword) ? `${forms.error} ${forms.ruleOk}` : forms.error}>
                {rule.label}
              </li>
            ))}
          </ul>
        )}
      </FormField>
      <SaveButton isVisible={isComplete} isSaving={isSaving} error={saveError} label="Cambiar contraseña" />
    </form>
  );
}
