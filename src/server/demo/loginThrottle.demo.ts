import 'server-only';
import { getDemoStore } from './demoStore';

/** Same API as auth/loginThrottle.mongo.ts, in memory (DEMO MODE): 5 failures → 10 min lock. */
const MAX_FAILURES = 5;
const LOCK_MS = 10 * 60 * 1000;

export async function getLockSecondsLeft(email: string): Promise<number> {
  const entry = getDemoStore().loginAttempts.get(email);
  if (!entry || entry.lockedUntil <= Date.now()) return 0;
  return Math.ceil((entry.lockedUntil - Date.now()) / 1000);
}

export async function recordFailedLogin(email: string): Promise<{ attemptsLeft: number; lockSecondsLeft: number }> {
  const attempts = getDemoStore().loginAttempts;
  const entry = attempts.get(email) ?? { count: 0, lockedUntil: 0 };
  entry.count += 1;
  if (entry.count < MAX_FAILURES) {
    attempts.set(email, entry);
    return { attemptsLeft: MAX_FAILURES - entry.count, lockSecondsLeft: 0 };
  }
  attempts.set(email, { count: 0, lockedUntil: Date.now() + LOCK_MS });
  return { attemptsLeft: 0, lockSecondsLeft: LOCK_MS / 1000 };
}

export async function clearFailedLogins(email: string): Promise<void> {
  getDemoStore().loginAttempts.delete(email);
}
