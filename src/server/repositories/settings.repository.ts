import 'server-only';
import { ObjectId } from 'mongodb';
import {
  EMPTY_BUSINESS_SETTINGS,
  type BusinessSettings,
  type HoursRowInput,
} from '@/features/business/types/BusinessSettings.type';
import { COLLECTIONS, getDb } from '../db/mongo';

/** One document holds all business settings. */
const SETTINGS_ID = 'business';

type SettingsDocument = Omit<BusinessSettings, 'updatedAt'> & { _id: string; updatedAt: Date };

async function collection() {
  return (await getDb()).collection<SettingsDocument>(COLLECTIONS.settings);
}

export async function getBusinessSettings(): Promise<BusinessSettings> {
  const document = await (await collection()).findOne({ _id: SETTINGS_ID });
  if (!document) return EMPTY_BUSINESS_SETTINGS;
  const { _id, updatedAt, ...rest } = document;
  void _id;
  return { ...EMPTY_BUSINESS_SETTINGS, ...rest, updatedAt: updatedAt.toISOString() };
}

/** Partial update (upsert): each section of the "Negocio" page saves only its own fields. */
export async function updateBusinessSettings(
  changes: Partial<Omit<BusinessSettings, 'updatedAt' | 'hours'>>,
): Promise<void> {
  await (await collection()).updateOne(
    { _id: SETTINGS_ID },
    { $set: { ...changes, updatedAt: new Date() } },
    { upsert: true },
  );
}

export async function addHoursRow(input: HoursRowInput): Promise<void> {
  const row = { ...input, id: new ObjectId().toHexString() };
  await (await collection()).updateOne(
    { _id: SETTINGS_ID },
    { $push: { hours: row }, $set: { updatedAt: new Date() } },
    { upsert: true },
  );
}

export async function updateHoursRow(rowId: string, input: HoursRowInput): Promise<boolean> {
  const result = await (await collection()).updateOne(
    { _id: SETTINGS_ID, 'hours.id': rowId },
    {
      $set: {
        'hours.$.label': input.label,
        'hours.$.opensAt': input.opensAt,
        'hours.$.closesAt': input.closesAt,
        updatedAt: new Date(),
      },
    },
  );
  return result.matchedCount === 1;
}

export async function deleteHoursRow(rowId: string): Promise<void> {
  await (await collection()).updateOne(
    { _id: SETTINGS_ID },
    { $pull: { hours: { id: rowId } }, $set: { updatedAt: new Date() } },
  );
}
