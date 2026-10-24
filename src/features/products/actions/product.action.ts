'use server';

import { revalidatePath } from 'next/cache';
import { actionFailure, actionSuccess, type ActionResult } from '@/features/core/types/ActionResult.type';
import { getActionSession, NOT_LOGGED_IN_ERROR } from '@/server/auth/dal';
import { refreshPublicSite } from '@/server/publicSite';
import { listCategories } from '@/server/repositories/categories.repository';
import {
  createProduct,
  deleteProduct,
  setProductFlag,
  updateProduct,
} from '@/server/repositories/products.repository';
import type { ProductInput } from '../types/Product.type';
import { getProductProblems, normalizeProductInput } from '../utils/product.validation';

const SAVE_ERROR = 'No pudimos guardar el producto. Intenta nuevamente.';

/** Server-side validation — never trust the form. Returns the first problem, or ''. */
async function validate(input: ProductInput): Promise<string> {
  const categoryIds = (await listCategories()).map((category) => category.slug);
  const problems = getProductProblems(input, categoryIds);
  return Object.values(problems)[0] ?? '';
}

export async function saveProduct(productId: string, rawInput: ProductInput): Promise<ActionResult> {
  if (!(await getActionSession())) return actionFailure(NOT_LOGGED_IN_ERROR);
  const input = normalizeProductInput(rawInput);
  try {
    const problem = await validate(input);
    if (problem) return actionFailure(problem);
    if (productId === '') {
      await createProduct(input);
    } else if (!(await updateProduct(productId, input))) {
      return actionFailure('Este producto ya no existe. Recarga la página.');
    }
    revalidatePath('/productos');
    revalidatePath('/categorias');
    await refreshPublicSite();
    return actionSuccess(true);
  } catch {
    return actionFailure(SAVE_ERROR);
  }
}

export async function toggleProductFlag(
  productId: string,
  flag: 'isAvailable' | 'isFeatured',
  value: boolean,
): Promise<ActionResult> {
  if (!(await getActionSession())) return actionFailure(NOT_LOGGED_IN_ERROR);
  try {
    if (!(await setProductFlag(productId, flag, value))) return actionFailure('Este producto ya no existe.');
    revalidatePath('/productos');
    revalidatePath('/categorias');
    await refreshPublicSite();
    return actionSuccess(true);
  } catch {
    return actionFailure(SAVE_ERROR);
  }
}

export async function removeProduct(productId: string): Promise<ActionResult> {
  if (!(await getActionSession())) return actionFailure(NOT_LOGGED_IN_ERROR);
  try {
    await deleteProduct(productId);
    revalidatePath('/productos');
    revalidatePath('/categorias');
    await refreshPublicSite();
    return actionSuccess(true);
  } catch {
    return actionFailure('No pudimos eliminar el producto. Intenta nuevamente.');
  }
}
