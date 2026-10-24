import { isValidTime } from '@/features/core/utils/format.util';
import { getMediaUrlProblem, isGoogleMapsShortLink, parseMapsCoordinates } from '@/features/core/utils/links.util';
import type { BrandInput, ContactInput, HoursRowInput, LocationInput } from '../types/BusinessSettings.type';

type Problems<T> = Partial<Record<keyof T, string>>;

/** International phone: country code + number, digits only (e.g. 584126722218). */
const PHONE_DIGITS = /^\d{10,15}$/;
const INSTAGRAM_HANDLE = /^[a-zA-Z0-9._]{1,30}$/;

export function getContactProblems(input: ContactInput): Problems<ContactInput> {
  const problems: Problems<ContactInput> = {};
  if (!PHONE_DIGITS.test(input.whatsappNumber)) {
    problems.whatsappNumber = 'Entre 10 y 15 dígitos, con el código del país (51 para Perú)';
  }
  if (input.phoneNumber !== '' && !PHONE_DIGITS.test(input.phoneNumber)) {
    problems.phoneNumber = 'Entre 10 y 15 dígitos, con el código del país (51 para Perú)';
  }
  const handle = input.instagramHandle.replace(/^@/, '').trim();
  if (handle !== '' && !INSTAGRAM_HANDLE.test(handle)) {
    problems.instagramHandle = 'Solo letras, números, puntos y guiones bajos (sin espacios)';
  }
  return problems;
}

export function getLocationProblems(input: LocationInput): Problems<LocationInput> {
  const problems: Problems<LocationInput> = {};
  if (input.address.trim() === '') problems.address = 'Escribe la dirección';
  if (input.city.trim() === '') problems.city = 'Escribe la ciudad';
  const mapsUrl = input.mapsUrl.trim();
  // Short "Compartir" links are accepted here; the server resolves them when saving.
  if (mapsUrl !== '' && !isGoogleMapsShortLink(mapsUrl) && parseMapsCoordinates(mapsUrl) === null) {
    problems.mapsUrl = 'No encontramos la ubicación en ese enlace. Abre el lugar en Google Maps y copia el enlace de la barra de direcciones.';
  }
  return problems;
}

export function getHoursRowProblems(input: HoursRowInput): Problems<HoursRowInput> {
  const problems: Problems<HoursRowInput> = {};
  if (input.label.trim() === '') problems.label = 'Escribe los días (ej. Martes a viernes)';
  if (!isValidTime(input.opensAt)) problems.opensAt = 'Hora inválida (00:00 a 23:59)';
  if (!isValidTime(input.closesAt)) problems.closesAt = 'Hora inválida (00:00 a 23:59)';
  return problems;
}

export function getBrandProblems(input: BrandInput): Problems<BrandInput> {
  const problems: Problems<BrandInput> = {};
  if (input.name.trim() === '') problems.name = 'Escribe el nombre del negocio';
  const heroProblem = getMediaUrlProblem(input.heroImageUrl.trim());
  if (heroProblem) problems.heroImageUrl = heroProblem;
  return problems;
}

export function hasProblems(problems: object): boolean {
  return Object.keys(problems).length > 0;
}
