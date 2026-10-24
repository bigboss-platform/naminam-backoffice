/**
 * Seeds the local MongoDB: indexes, the first admin, and the Santanita menu + business info
 * (scripts/seed-data.json — generated from naminam-menu/src/features/menu/data/menu.data.ts).
 *
 *   npm run seed            → creates what's missing (safe to run again; never overwrites edits)
 *   npm run seed -- --reset → wipes products, categories and settings, then seeds them again
 *
 * Reads MONGODB_URI, MONGODB_DB, ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD from .env.local.
 */
import { randomBytes, scrypt as scryptCallback } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { promisify } from 'node:util';
import { MongoClient, ObjectId } from 'mongodb';

const scrypt = promisify(scryptCallback);

function loadEnvFile(path) {
  const env = {};
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const match = /^\s*([A-Z_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (match) env[match[1]] = match[2];
  }
  return env;
}

/** Same format as src/server/auth/password.ts → "scrypt$salt$hash". */
async function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString('base64')}$${hash.toString('base64')}`;
}

const env = { ...loadEnvFile('.env.local'), ...process.env };
const isReset = process.argv.includes('--reset');
const seed = JSON.parse(readFileSync(new URL('./seed-data.json', import.meta.url), 'utf8'));

const client = new MongoClient(env.MONGODB_URI);
await client.connect();
const db = client.db(env.MONGODB_DB);

await db.collection('admins').createIndex({ email: 1 }, { unique: true });
await db.collection('products').createIndex({ slug: 1 }, { unique: true });
await db.collection('products').createIndex({ categoryId: 1, sortOrder: 1 });
await db.collection('categories').createIndex({ slug: 1 }, { unique: true });
// Login lockout (server/auth/loginThrottle.ts) — old attempts expire by themselves
await db.collection('loginAttempts').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

if (isReset) {
  await Promise.all(['products', 'categories', 'settings'].map((name) => db.collection(name).deleteMany({})));
  console.log('Reset: products, categories and settings wiped');
}

const adminEmail = env.ADMIN_EMAIL.trim().toLowerCase();
if (!(await db.collection('admins').findOne({ email: adminEmail }))) {
  await db.collection('admins').insertOne({
    email: adminEmail,
    name: env.ADMIN_NAME || 'Admin',
    passwordHash: await hashPassword(env.ADMIN_PASSWORD),
    createdAt: new Date(),
  });
  console.log(`Admin created: ${adminEmail}`);
}

if ((await db.collection('categories').countDocuments()) === 0) {
  await db.collection('categories').insertMany(seed.categories.map((category) => ({ _id: new ObjectId(), ...category })));
  console.log(`${seed.categories.length} categories`);
}

if ((await db.collection('products').countDocuments()) === 0) {
  const now = new Date();
  await db.collection('products').insertMany(
    seed.products.map((product) => ({ _id: new ObjectId(), ...product, createdAt: now, updatedAt: now })),
  );
  console.log(`${seed.products.length} products`);
}

if (!(await db.collection('settings').findOne({ _id: 'business' }))) {
  await db.collection('settings').insertOne({ _id: 'business', ...seed.settings, updatedAt: new Date() });
  console.log('Business settings');
}

await client.close();
console.log('Seed done.');
