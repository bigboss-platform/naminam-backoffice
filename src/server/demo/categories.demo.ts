import 'server-only';
import { slugify } from '@/features/core/utils/format.util';
import type { Category, CategoryInput } from '@/features/products/types/Category.type';
import { getDemoStore, newDemoId, uniqueSlug } from './demoStore';

/** Same API as repositories/mongo/categories.mongo.ts, in memory (DEMO MODE). */

export async function listCategories(): Promise<Category[]> {
  return [...getDemoStore().categories].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function findCategoryById(categoryId: string): Promise<Category | null> {
  return getDemoStore().categories.find((category) => category.id === categoryId) ?? null;
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  const store = getDemoStore();
  const category: Category = {
    id: newDemoId(),
    slug: uniqueSlug(slugify(input.label) || 'categoria', store.categories.map((item) => item.slug)),
    label: input.label,
    tagline: input.tagline,
    sortOrder: Math.max(0, ...store.categories.map((item) => item.sortOrder)) + 1,
  };
  store.categories.push(category);
  return category;
}

export async function updateCategory(categoryId: string, input: CategoryInput): Promise<boolean> {
  const category = getDemoStore().categories.find((item) => item.id === categoryId);
  if (!category) return false;
  category.label = input.label;
  category.tagline = input.tagline;
  return true;
}

export async function deleteCategory(categoryId: string): Promise<boolean> {
  const store = getDemoStore();
  const before = store.categories.length;
  store.categories = store.categories.filter((item) => item.id !== categoryId);
  return store.categories.length < before;
}

/** Swap positions with the neighbour above (-1) or below (+1). */
export async function moveCategory(categoryId: string, direction: -1 | 1): Promise<void> {
  const ordered = await listCategories();
  const index = ordered.findIndex((category) => category.id === categoryId);
  const neighbour = ordered[index + direction];
  if (index === -1 || !neighbour) return;
  const current = ordered[index];
  [current.sortOrder, neighbour.sortOrder] = [neighbour.sortOrder, current.sortOrder];
}
