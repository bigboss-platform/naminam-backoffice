'use client';

import { BottomSheet } from '@/features/core/components/BottomSheet.component';
import type { AccountActionsCtx } from '../hooks/useAccountActions.hook';
import { ChangePasswordForm } from './ChangePasswordForm.component';

/** Drawer on mobile, modal on desktop (BottomSheet switches by media query). */
export function ChangePasswordSheet({ ctx }: { ctx: AccountActionsCtx }) {
  return (
    <BottomSheet open={ctx.isPasswordOpen} onClose={ctx.closePassword} title="Cambiar contraseña">
      <ChangePasswordForm key={ctx.formKey} onSaved={ctx.onPasswordSaved} />
    </BottomSheet>
  );
}
