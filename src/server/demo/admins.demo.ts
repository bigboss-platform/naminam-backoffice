import 'server-only';
import { hashPassword } from '../auth/password';
import type { AdminRecord } from '../repositories/mongo/admins.mongo';
import { DEMO_ADMIN } from './demoMode';
import { getDemoStore } from './demoStore';

/** Same API as repositories/mongo/admins.mongo.ts, in memory (DEMO MODE): one demo admin. */

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** The demo admin is created on first use (its password hash needs an async scrypt call). */
async function admins(): Promise<AdminRecord[]> {
  const store = getDemoStore();
  if (store.admins.length === 0) {
    store.admins.push({ id: 'demo-admin', email: DEMO_ADMIN.email, name: DEMO_ADMIN.name, passwordHash: await hashPassword(DEMO_ADMIN.password) });
  }
  return store.admins;
}

export async function findAdminByEmail(email: string): Promise<AdminRecord | null> {
  return (await admins()).find((admin) => admin.email === normalizeEmail(email)) ?? null;
}

export async function findAdminById(adminId: string): Promise<AdminRecord | null> {
  return (await admins()).find((admin) => admin.id === adminId) ?? null;
}

export async function updateAdminPassword(adminId: string, passwordHash: string): Promise<void> {
  const admin = (await admins()).find((item) => item.id === adminId);
  if (admin) admin.passwordHash = passwordHash;
}
