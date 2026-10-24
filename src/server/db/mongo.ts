import 'server-only';
import { MongoClient, type Db } from 'mongodb';

/**
 * Server-only MongoDB access. The browser never talks to MongoDB and credentials never
 * reach client code (no NEXT_PUBLIC_*). One client per process; cached on globalThis so
 * dev hot-reloads don't open a new connection pool each time.
 */
const globalForMongo = globalThis as typeof globalThis & { naminamMongoClient?: Promise<MongoClient> };

function readEnv(name: 'MONGODB_URI' | 'MONGODB_DB'): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} no está configurado (revisa .env.local)`);
  return value;
}

function getClient(): Promise<MongoClient> {
  if (!globalForMongo.naminamMongoClient) {
    const client = new MongoClient(readEnv('MONGODB_URI'), { maxPoolSize: 5 });
    globalForMongo.naminamMongoClient = client.connect();
  }
  return globalForMongo.naminamMongoClient;
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db(readEnv('MONGODB_DB'));
}

export const COLLECTIONS = {
  admins: 'admins',
  products: 'products',
  categories: 'categories',
  settings: 'settings',
  loginAttempts: 'loginAttempts',
} as const;
