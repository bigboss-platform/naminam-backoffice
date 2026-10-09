'use server';

import { actionFailure, actionSuccess, type ActionResult } from '@/features/core/types/ActionResult.type';
import { findAdminByEmail, normalizeEmail } from '@/server/repositories/admins.repository';
import { clearFailedLogins, getLockMinutesLeft, recordFailedLogin } from '@/server/auth/loginThrottle';
import { verifyPassword } from '@/server/auth/password';
import { createSession, deleteSession } from '@/server/auth/session';

const UNEXPECTED_ERROR = 'No pudimos conectarnos. Intenta nuevamente en un momento.';

/** Login step 1 — checked when "Siguiente" is pressed (workspace auth rule), never while typing. */
export async function checkAdminEmail(email: string): Promise<ActionResult> {
  try {
    const admin = await findAdminByEmail(email);
    return admin ? actionSuccess(true) : actionFailure('Este correo no está registrado');
  } catch {
    return actionFailure(UNEXPECTED_ERROR);
  }
}

export async function login(email: string, password: string): Promise<ActionResult> {
  const normalizedEmail = normalizeEmail(email);
  const lockMinutes = getLockMinutesLeft(normalizedEmail);
  if (lockMinutes > 0) {
    return actionFailure(`Demasiados intentos. Espera ${lockMinutes} min e intenta de nuevo.`);
  }
  try {
    const admin = await findAdminByEmail(normalizedEmail);
    const isValid = admin !== null && (await verifyPassword(password, admin.passwordHash));
    if (!admin || !isValid) {
      recordFailedLogin(normalizedEmail);
      return actionFailure('La contraseña no es correcta');
    }
    clearFailedLogins(normalizedEmail);
    await createSession({ adminId: admin.id, email: admin.email, name: admin.name });
    return actionSuccess(true);
  } catch {
    return actionFailure(UNEXPECTED_ERROR);
  }
}

export async function logout(): Promise<ActionResult> {
  await deleteSession();
  return actionSuccess(true);
}
