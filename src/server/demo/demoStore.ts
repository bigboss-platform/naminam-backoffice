import 'server-only';
import { randomBytes } from 'node:crypto';
import type { BusinessSettings } from '@/features/business/types/BusinessSettings.type';
import type { Category } from '@/features/products/types/Category.type';
import type { Product } from '@/features/products/types/Product.type';
import seed from '../../../scripts/seed-data.json';

/**
 * In-memory data for DEMO MODE (see demoMode.ts), seeded from scripts/seed-data.json.
 * Kept on globalThis so it survives dev hot reloads; it is lost when the process restarts.
 */
export type DemoAdmin = { id: string; email: string; name: string; passwordHash: string };

export type DemoStore = {
  admins: DemoAdmin[];
  products: Product[];
  categories: Category[];
  settings: BusinessSettings;
  loginAttempts: Map<string, { count: number; lockedUntil: number }>;
};

export function newDemoId(): string {
  return randomBytes(12).toString('hex');
}

function createStore(): DemoStore {
  const now = new Date().toISOString();
  return {
    admins: [],
    categories: seed.categories.map((category) => ({ id: newDemoId(), ...category })),
    products: seed.products.map((product) => ({
      ...product,
      id: newDemoId(),
      mediaType: product.mediaType === 'video' ? 'video' : 'image',
      updatedAt: now,
    })),
    settings: { ...seed.settings, hours: seed.settings.hours.map((row) => ({ ...row })), updatedAt: now },
    loginAttempts: new Map(),
  };
}

const globalForDemo = globalThis as typeof globalThis & { santanitaDemoStore?: DemoStore };

export function getDemoStore(): DemoStore {
  globalForDemo.santanitaDemoStore ??= createStore();
  return globalForDemo.santanitaDemoStore;
}

/** Unique slug among `taken` ("tortas", "tortas-2", …). */
export function uniqueSlug(base: string, taken: string[]): string {
  let slug = base;
  for (let suffix = 2; taken.includes(slug); suffix += 1) slug = `${base}-${suffix}`;
  return slug;
}
