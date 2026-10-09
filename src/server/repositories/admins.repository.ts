import 'server-only';
import { ObjectId } from 'mongodb';
import { COLLECTIONS, getDb } from '../db/mongo';

export type AdminRecord = { id: string; email: string; name: string; passwordHash: string };

type AdminDocument = { _id: ObjectId; email: string; name: string; passwordHash: string; createdAt: Date };

function toRecord(document: AdminDocument): AdminRecord {
  return { id: document._id.toHexString(), email: document.email, name: document.name, passwordHash: document.passwordHash };
}

async function collection() {
  return (await getDb()).collection<AdminDocument>(COLLECTIONS.admins);
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function findAdminByEmail(email: string): Promise<AdminRecord | null> {
  const document = await (await collection()).findOne({ email: normalizeEmail(email) });
  return document ? toRecord(document) : null;
}

export async function findAdminById(adminId: string): Promise<AdminRecord | null> {
  if (!ObjectId.isValid(adminId)) return null;
  const document = await (await collection()).findOne({ _id: new ObjectId(adminId) });
  return document ? toRecord(document) : null;
}

export async function updateAdminPassword(adminId: string, passwordHash: string): Promise<void> {
  await (await collection()).updateOne({ _id: new ObjectId(adminId) }, { $set: { passwordHash } });
}
