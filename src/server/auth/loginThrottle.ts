import 'server-only';
import { COLLECTIONS, getDb } from '../db/mongo';

/**
 * Brute-force protection: after 5 wrong passwords for an email, block that email for 10
 * minutes. Stored in MongoDB (not in memory) so it holds on serverless hosting, where each
 * request can hit a different instance. A TTL index removes old documents by itself.
 */
const MAX_FAILURES = 5;
const LOCK_MS = 10 * 60 * 1000;
/** Failure counts are forgotten after a day without new failures. */
const FAILURE_MEMORY_MS = 24 * 60 * 60 * 1000;

type LoginAttemptDocument = { _id: string; count: number; lockedUntil: Date; expiresAt: Date };

const globalForThrottle = globalThis as typeof globalThis & { naminamThrottleIndex?: Promise<string> };

async function collection() {
  const attempts = (await getDb()).collection<LoginAttemptDocument>(COLLECTIONS.loginAttempts);
  globalForThrottle.naminamThrottleIndex ??= attempts.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  await globalForThrottle.naminamThrottleIndex;
  return attempts;
}

/** Seconds until the email can try again (0 = not locked). The login shows it as a countdown. */
export async function getLockSecondsLeft(email: string): Promise<number> {
  const entry = await (await collection()).findOne({ _id: email });
  if (!entry || entry.lockedUntil.getTime() <= Date.now()) return 0;
  return Math.ceil((entry.lockedUntil.getTime() - Date.now()) / 1000);
}

/** Records a wrong password; returns the attempts left, or the lock length when it just locked. */
export async function recordFailedLogin(email: string): Promise<{ attemptsLeft: number; lockSecondsLeft: number }> {
  const attempts = await collection();
  const now = Date.now();
  const entry = await attempts.findOneAndUpdate(
    { _id: email },
    { $inc: { count: 1 }, $set: { expiresAt: new Date(now + FAILURE_MEMORY_MS) }, $setOnInsert: { lockedUntil: new Date(0) } },
    { upsert: true, returnDocument: 'after' },
  );
  const count = entry?.count ?? 1;
  if (count < MAX_FAILURES) return { attemptsLeft: MAX_FAILURES - count, lockSecondsLeft: 0 };

  const lockedUntil = new Date(now + LOCK_MS);
  await attempts.updateOne({ _id: email }, { $set: { count: 0, lockedUntil, expiresAt: lockedUntil } });
  return { attemptsLeft: 0, lockSecondsLeft: LOCK_MS / 1000 };
}

export async function clearFailedLogins(email: string): Promise<void> {
  await (await collection()).deleteOne({ _id: email });
}
