import 'server-only';

/**
 * Basic brute-force protection: after 5 wrong passwords for an email, block that email
 * for 10 minutes. In-memory (resets on server restart) — enough for a single-instance
 * small-business admin; move to MongoDB if the app ever runs on several instances.
 */
const MAX_FAILURES = 5;
const LOCK_MS = 10 * 60 * 1000;

const failures = new Map<string, { count: number; lockedUntil: number }>();

export function getLockMinutesLeft(email: string): number {
  const entry = failures.get(email);
  if (!entry || entry.lockedUntil <= Date.now()) return 0;
  return Math.ceil((entry.lockedUntil - Date.now()) / 60000);
}

export function recordFailedLogin(email: string): void {
  const entry = failures.get(email) ?? { count: 0, lockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= MAX_FAILURES) {
    entry.lockedUntil = Date.now() + LOCK_MS;
    entry.count = 0;
  }
  failures.set(email, entry);
}

export function clearFailedLogins(email: string): void {
  failures.delete(email);
}
