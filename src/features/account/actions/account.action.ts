'use server';

import { actionFailure, actionSuccess, type ActionResult } from '@/features/core/types/ActionResult.type';
import { getActionSession, NOT_LOGGED_IN_ERROR } from '@/server/auth/dal';
import { hashPassword, verifyPassword } from '@/server/auth/password';
import { findAdminById, updateAdminPassword } from '@/server/repositories/admins.repository';
import { isStrongPassword } from '../utils/password.rules';

export async function changePassword(currentPassword: string, newPassword: string): Promise<ActionResult> {
  const session = await getActionSession();
  if (!session) return actionFailure(NOT_LOGGED_IN_ERROR);
  if (!isStrongPassword(newPassword)) return actionFailure('La nueva contraseña no cumple las reglas');
  try {
    const admin = await findAdminById(session.adminId);
    if (!admin || !(await verifyPassword(currentPassword, admin.passwordHash))) {
      return actionFailure('La contraseña actual no es correcta');
    }
    await updateAdminPassword(admin.id, await hashPassword(newPassword));
    return actionSuccess(true);
  } catch {
    return actionFailure('No pudimos cambiar la contraseña. Intenta nuevamente.');
  }
}
