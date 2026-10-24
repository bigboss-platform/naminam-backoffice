'use server';

import { actionFailure, actionSuccess, type ActionResult } from '@/features/core/types/ActionResult.type';
import { findAdminByEmail, normalizeEmail } from '@/server/repositories/admins.repository';
import { clearFailedLogins, getLockSecondsLeft, recordFailedLogin } from '@/server/auth/loginThrottle';
import { verifyPassword } from '@/server/auth/password';
import { createSession, deleteSession } from '@/server/auth/session';
import { SUPPORT_ERROR, type EmailCheck, type LoginOutcome } from '../types/Login.type';
import { isEmailFormatValid } from '../utils/email.util';

/** Login step 1 — runs automatically once the email has a valid format (no button press). */
export async function checkAdminEmail(email: string): Promise<ActionResult<EmailCheck>> {
  const normalizedEmail = normalizeEmail(email);
  if (!isEmailFormatValid(normalizedEmail)) return actionSuccess<EmailCheck>({ exists: false, lockSecondsLeft: 0 });
  try {
    const admin = await findAdminByEmail(normalizedEmail);
    const lockSecondsLeft = admin ? await getLockSecondsLeft(normalizedEmail) : 0;
    return actionSuccess<EmailCheck>({ exists: admin !== null, lockSecondsLeft });
  } catch {
    return actionFailure<EmailCheck>(SUPPORT_ERROR);
  }
}

export async function login(email: string, password: string): Promise<ActionResult<LoginOutcome>> {
  const normalizedEmail = normalizeEmail(email);
  try {
    const lockSecondsLeft = await getLockSecondsLeft(normalizedEmail);
    if (lockSecondsLeft > 0) return actionSuccess<LoginOutcome>({ kind: 'locked', lockSecondsLeft });
    const admin = await findAdminByEmail(normalizedEmail);
    const isValid = admin !== null && (await verifyPassword(password, admin.passwordHash));
    if (!admin || !isValid) {
      const failure = await recordFailedLogin(normalizedEmail);
      return failure.lockSecondsLeft > 0
        ? actionSuccess<LoginOutcome>({ kind: 'locked', lockSecondsLeft: failure.lockSecondsLeft })
        : actionSuccess<LoginOutcome>({ kind: 'wrong-password', attemptsLeft: failure.attemptsLeft });
    }
    await clearFailedLogins(normalizedEmail);
    await createSession({ adminId: admin.id, email: admin.email, name: admin.name });
    return actionSuccess<LoginOutcome>({ kind: 'signed-in' });
  } catch {
    return actionFailure<LoginOutcome>(SUPPORT_ERROR);
  }
}

export async function logout(): Promise<ActionResult> {
  await deleteSession();
  return actionSuccess(true);
}
