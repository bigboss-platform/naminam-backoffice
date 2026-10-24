import 'server-only';
import type { BusinessSettings, HoursRowInput } from '@/features/business/types/BusinessSettings.type';
import { getDemoStore, newDemoId } from './demoStore';

/** Same API as repositories/mongo/settings.mongo.ts, in memory (DEMO MODE). */

function touch() {
  getDemoStore().settings.updatedAt = new Date().toISOString();
}

export async function getBusinessSettings(): Promise<BusinessSettings> {
  const { settings } = getDemoStore();
  return { ...settings, hours: settings.hours.map((row) => ({ ...row })) };
}

export async function updateBusinessSettings(changes: Partial<Omit<BusinessSettings, 'updatedAt' | 'hours'>>): Promise<void> {
  Object.assign(getDemoStore().settings, changes);
  touch();
}

export async function addHoursRow(input: HoursRowInput): Promise<void> {
  getDemoStore().settings.hours.push({ ...input, id: newDemoId() });
  touch();
}

export async function updateHoursRow(rowId: string, input: HoursRowInput): Promise<boolean> {
  const row = getDemoStore().settings.hours.find((item) => item.id === rowId);
  if (!row) return false;
  Object.assign(row, input);
  touch();
  return true;
}

export async function deleteHoursRow(rowId: string): Promise<void> {
  const { settings } = getDemoStore();
  settings.hours = settings.hours.filter((row) => row.id !== rowId);
  touch();
}
