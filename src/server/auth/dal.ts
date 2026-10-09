import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { decryptSession, SESSION_COOKIE, type SessionPayload } from './session';

/**
 * Data Access Layer auth checks (Next.js auth guide). The proxy only does an optimistic
 * redirect — the real check happens here, next to every data read and every Server Action.
 */
export const getSession = cache(async (): Promise<SessionPayload | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value ?? '';
  return decryptSession(token);
});

/** Pages: send visitors without a valid session to /login. */
export async function requirePageSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect('/login');
  return session;
}

/** Server Actions: null when not logged in (the action returns a friendly error instead of throwing). */
export async function getActionSession(): Promise<SessionPayload | null> {
  return getSession();
}

export const NOT_LOGGED_IN_ERROR = 'Tu sesión expiró. Vuelve a iniciar sesión.';
