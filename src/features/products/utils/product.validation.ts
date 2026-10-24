import { getMediaUrlProblem } from '@/features/core/utils/links.util';
import type { CategoryInput } from '../types/Category.type';
import type { ProductInput } from '../types/Product.type';

export const PRODUCT_LIMITS = {
  nameMax: 60,
  descriptionMax: 220,
  noteMax: 40,
  badgeMax: 28,
  priceMax: 1000,
} as const;

/**
 * Field → specific problem (Spanish, shown under the field). Empty object = valid.
 * Used by the form (to decide when "Guardar" appears) and re-checked on the server.
 */
export function getProductProblems(input: ProductInput, categoryIds: string[]): Partial<Record<keyof ProductInput, string>> {
  const problems: Partial<Record<keyof ProductInput, string>> = {};
  const name = input.name.trim();
  if (name === '') problems.name = 'Escribe el nombre del producto';
  else if (name.length > PRODUCT_LIMITS.nameMax) problems.name = `Máximo ${PRODUCT_LIMITS.nameMax} caracteres`;

  if (!categoryIds.includes(input.categoryId)) problems.categoryId = 'Elige una categoría';

  if (!(input.price > 0)) problems.price = 'El precio debe ser mayor a 0';
  else if (input.price > PRODUCT_LIMITS.priceMax) problems.price = `Máximo $${PRODUCT_LIMITS.priceMax}`;

  const description = input.description.trim();
  if (description === '') problems.description = 'Escribe una descripción corta';
  else if (description.length > PRODUCT_LIMITS.descriptionMax) {
    problems.description = `Máximo ${PRODUCT_LIMITS.descriptionMax} caracteres`;
  }

  if (input.note.trim().length > PRODUCT_LIMITS.noteMax) problems.note = `Máximo ${PRODUCT_LIMITS.noteMax} caracteres`;
  if (input.badge.trim().length > PRODUCT_LIMITS.badgeMax) problems.badge = `Máximo ${PRODUCT_LIMITS.badgeMax} caracteres`;

  const mediaProblem = getMediaUrlProblem(input.mediaUrl.trim());
  if (mediaProblem) problems.mediaUrl = mediaProblem;
  const posterProblem = getMediaUrlProblem(input.posterUrl.trim());
  if (posterProblem) problems.posterUrl = posterProblem;

  if (input.mediaType !== 'image' && input.mediaType !== 'video') problems.mediaType = 'Elige foto o video';
  return problems;
}

/** Trims text fields so what's saved is clean. */
export function normalizeProductInput(input: ProductInput): ProductInput {
  return {
    ...input,
    name: input.name.trim(),
    description: input.description.trim(),
    note: input.note.trim(),
    badge: input.badge.trim(),
    mediaUrl: input.mediaUrl.trim(),
    posterUrl: input.mediaType === 'video' ? input.posterUrl.trim() : '',
    price: Math.round(input.price * 100) / 100,
  };
}

export const CATEGORY_LIMITS = { labelMax: 30, taglineMax: 80 } as const;

export function getCategoryProblems(input: CategoryInput): Partial<Record<keyof CategoryInput, string>> {
  const problems: Partial<Record<keyof CategoryInput, string>> = {};
  const label = input.label.trim();
  if (label === '') problems.label = 'Escribe el nombre de la categoría';
  else if (label.length > CATEGORY_LIMITS.labelMax) problems.label = `Máximo ${CATEGORY_LIMITS.labelMax} caracteres`;
  if (input.tagline.trim().length > CATEGORY_LIMITS.taglineMax) {
    problems.tagline = `Máximo ${CATEGORY_LIMITS.taglineMax} caracteres`;
  }
  return problems;
}
