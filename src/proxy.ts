import { jwtVerify } from 'jose';
import { NextResponse, type NextRequest } from 'next/server';
import { getSessionSecret } from './server/auth/sessionSecret';

/**
 * Optimistic auth redirect (Next.js 16 "proxy", formerly middleware). Only reads the
 * cookie — the real check happens in the Data Access Layer (src/server/auth/dal.ts) next
 * to every data read and Server Action.
 */
const SESSION_COOKIE = 'santanita_session';
const PUBLIC_PATHS = ['/login'];

async function hasValidSession(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const secret = getSessionSecret();
  if (!token || !secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret), { algorithms: ['HS256'] });
    return true;
  } catch {
    return false;
  }
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicPath = PUBLIC_PATHS.includes(pathname);
  const isLoggedIn = await hasValidSession(request);

  if (!isPublicPath && !isLoggedIn) return NextResponse.redirect(new URL('/login', request.nextUrl));
  if (isPublicPath && isLoggedIn) return NextResponse.redirect(new URL('/productos', request.nextUrl));
  return NextResponse.next();
}

export const config = {
  // Everything except Next internals and static files (icons, brand images).
  matcher: ['/((?!_next/static|_next/image|brand/|icon.png|apple-icon.png|favicon.ico).*)'],
};
