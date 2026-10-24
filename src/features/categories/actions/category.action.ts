'use server';

import { revalidatePath } from 'next/cache';
import { actionFailure, actionSuccess, type ActionResult } from '@/features/core/types/ActionResult.type';
import type { CategoryInput } from '@/features/products/types/Category.type';
import { getCategoryProblems } from '@/features/products/utils/product.validation';
import { getActionSession, NOT_LOGGED_IN_ERROR } from '@/server/auth/dal';
import { refreshPublicSite } from '@/server/publicSite';
import {
  createCategory,
  deleteCategory,
  findCategoryById,
  moveCategory,
  updateCategory,
} from '@/server/repositories/categories.repository';
import { countProductsInCategory } from '@/server/repositories/products.repository';

const SAVE_ERROR = 'No pudimos guardar la categoría. Intenta nuevamente.';

export async function saveCategory(categoryId: string, rawInput: CategoryInput): Promise<ActionResult> {
  if (!(await getActionSession())) return actionFailure(NOT_LOGGED_IN_ERROR);
  const input = { label: rawInput.label.trim(), tagline: rawInput.tagline.trim() };
  const problem = Object.values(getCategoryProblems(input))[0];
  if (problem) return actionFailure(problem);
  try {
    if (categoryId === '') await createCategory(input);
    else if (!(await updateCategory(categoryId, input))) return actionFailure('Esta categoría ya no existe.');
    revalidatePath('/productos');
    revalidatePath('/categorias');
    await refreshPublicSite();
    return actionSuccess(true);
  } catch {
    return actionFailure(SAVE_ERROR);
  }
}

/** A category can only be deleted when no dessert uses it (no orphan products). */
export async function removeCategory(categoryId: string): Promise<ActionResult> {
  if (!(await getActionSession())) return actionFailure(NOT_LOGGED_IN_ERROR);
  try {
    const category = await findCategoryById(categoryId);
    if (!category) return actionFailure('Esta categoría ya no existe.');
    const productCount = await countProductsInCategory(category.slug);
    if (productCount > 0) {
      const plural = productCount === 1 ? 'postre' : 'postres';
      return actionFailure(`Tiene ${productCount} ${plural}. Muévelos a otra categoría antes de eliminarla.`);
    }
    await deleteCategory(categoryId);
    revalidatePath('/productos');
    revalidatePath('/categorias');
    await refreshPublicSite();
    return actionSuccess(true);
  } catch {
    return actionFailure('No pudimos eliminar la categoría. Intenta nuevamente.');
  }
}

export async function reorderCategory(categoryId: string, direction: -1 | 1): Promise<ActionResult> {
  if (!(await getActionSession())) return actionFailure(NOT_LOGGED_IN_ERROR);
  try {
    await moveCategory(categoryId, direction);
    revalidatePath('/productos');
    revalidatePath('/categorias');
    await refreshPublicSite();
    return actionSuccess(true);
  } catch {
    return actionFailure(SAVE_ERROR);
  }
}
