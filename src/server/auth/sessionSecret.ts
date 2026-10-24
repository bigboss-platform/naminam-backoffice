/**
 * Session signing secret, shared by the DAL (session.ts) and the proxy. DEMO MODE (no database,
 * demo data only) falls back to a fixed public key so the demo works without configuration —
 * any real deployment sets SESSION_SECRET.
 * No 'server-only' import: the proxy imports this file too.
 */
const DEMO_SESSION_SECRET = 'santanita-demo-mode-public-session-key-not-for-production';

export function getSessionSecret(): string | null {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  const isDemoMode = process.env.DEMO_MODE === 'true' || !process.env.MONGODB_URI;
  return isDemoMode ? DEMO_SESSION_SECRET : null;
}
