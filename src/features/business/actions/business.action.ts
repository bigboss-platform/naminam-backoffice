'use server';

import { revalidatePath } from 'next/cache';
import { actionFailure, actionSuccess, type ActionResult } from '@/features/core/types/ActionResult.type';
import { isGoogleMapsShortLink, parseMapsCoordinates } from '@/features/core/utils/links.util';
import { getActionSession, NOT_LOGGED_IN_ERROR } from '@/server/auth/dal';
import { refreshPublicSite } from '@/server/publicSite';
import {
  addHoursRow,
  deleteHoursRow,
  updateBusinessSettings,
  updateHoursRow,
} from '@/server/repositories/settings.repository';
import type { BrandInput, ContactInput, HoursRowInput, LocationInput } from '../types/BusinessSettings.type';
import {
  getBrandProblems,
  getContactProblems,
  getHoursRowProblems,
  getLocationProblems,
} from '../utils/business.validation';

const SAVE_ERROR = 'No pudimos guardar los cambios. Intenta nuevamente.';

/** Shared wrapper: session check → validation → save → refresh the page data. */
async function runSave(problems: object, save: () => Promise<void>): Promise<ActionResult> {
  if (!(await getActionSession())) return actionFailure(NOT_LOGGED_IN_ERROR);
  const problem = Object.values(problems)[0] as string | undefined;
  if (problem) return actionFailure(problem);
  try {
    await save();
    revalidatePath('/negocio');
    await refreshPublicSite();
    return actionSuccess(true);
  } catch {
    return actionFailure(SAVE_ERROR);
  }
}

export async function saveContact(input: ContactInput): Promise<ActionResult> {
  const clean: ContactInput = {
    whatsappNumber: input.whatsappNumber.trim(),
    phoneNumber: input.phoneNumber.trim(),
    instagramHandle: input.instagramHandle.replace(/^@/, '').trim(),
  };
  return runSave(getContactProblems(clean), () => updateBusinessSettings(clean));
}

/** Follows a Maps "Compartir" short link to the full URL (which contains the coordinates). */
async function resolveShortMapsLink(shortUrl: string): Promise<string> {
  try {
    const response = await fetch(shortUrl, { redirect: 'follow', signal: AbortSignal.timeout(8000) });
    return response.url;
  } catch {
    return '';
  }
}

export async function saveLocation(input: LocationInput): Promise<ActionResult> {
  const clean: LocationInput = { address: input.address.trim(), city: input.city.trim(), mapsUrl: input.mapsUrl.trim() };
  if (isGoogleMapsShortLink(clean.mapsUrl)) {
    if (!(await getActionSession())) return actionFailure(NOT_LOGGED_IN_ERROR);
    const fullUrl = await resolveShortMapsLink(clean.mapsUrl);
    if (!parseMapsCoordinates(fullUrl)) {
      return actionFailure('No pudimos leer la ubicación de ese enlace corto. Abre el lugar en Google Maps desde el navegador y copia el enlace completo.');
    }
    clean.mapsUrl = fullUrl;
  }
  const coordinates = parseMapsCoordinates(clean.mapsUrl);
  return runSave(getLocationProblems(clean), () =>
    updateBusinessSettings({
      ...clean,
      mapLatitude: coordinates?.latitude ?? 0,
      mapLongitude: coordinates?.longitude ?? 0,
    }),
  );
}

export async function saveBrand(input: BrandInput): Promise<ActionResult> {
  const clean: BrandInput = { name: input.name.trim(), tagline: input.tagline.trim(), heroImageUrl: input.heroImageUrl.trim() };
  return runSave(getBrandProblems(clean), () => updateBusinessSettings(clean));
}

/** rowId '' = add a new row. */
export async function saveHoursRow(rowId: string, input: HoursRowInput): Promise<ActionResult> {
  const clean: HoursRowInput = { label: input.label.trim(), opensAt: input.opensAt, closesAt: input.closesAt };
  return runSave(getHoursRowProblems(clean), async () => {
    if (rowId === '') await addHoursRow(clean);
    else await updateHoursRow(rowId, clean);
  });
}

export async function removeHoursRow(rowId: string): Promise<ActionResult> {
  return runSave({}, () => deleteHoursRow(rowId));
}
