import 'server-only';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

/**
 * Stateless session: a signed (HS256) JWT in an httpOnly cookie. Pattern from the
 * Next.js authentication guide (node_modules/next/dist/docs/01-app/02-guides/authentication.md).
 */
export const SESSION_COOKIE = 'santanita_session';
const SESSION_DAYS = 7;

export type SessionPayload = { adminId: string; email: string; name: string };

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error('SESSION_SECRET falta o es muy corto (revisa .env.local)');
  return new TextEncoder().encode(secret);
}

export async function encryptSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecretKey());
}

/** The session in the cookie, or null when missing / tampered / expired. */
export async function decryptSession(token: string): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), { algorithms: ['HS256'] });
    const { adminId, email, name } = payload as Partial<SessionPayload>;
    if (typeof adminId !== 'string' || typeof email !== 'string') return null;
    return { adminId, email, name: typeof name === 'string' ? name : '' };
  } catch {
    return null;
  }
}

export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await encryptSession(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000),
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
