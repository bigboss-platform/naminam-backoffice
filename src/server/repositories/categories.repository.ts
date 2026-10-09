import 'server-only';
import { ObjectId } from 'mongodb';
import { slugify } from '@/features/core/utils/format.util';
import type { Category, CategoryInput } from '@/features/products/types/Category.type';
import { COLLECTIONS, getDb } from '../db/mongo';

type CategoryDocument = { _id: ObjectId; slug: string; label: string; tagline: string; sortOrder: number };

function toCategory(document: CategoryDocument): Category {
  return {
    id: document._id.toHexString(),
    slug: document.slug,
    label: document.label,
    tagline: document.tagline,
    sortOrder: document.sortOrder,
  };
}

async function collection() {
  return (await getDb()).collection<CategoryDocument>(COLLECTIONS.categories);
}

export async function listCategories(): Promise<Category[]> {
  const documents = await (await collection()).find().sort({ sortOrder: 1 }).toArray();
  return documents.map(toCategory);
}

export async function findCategoryById(categoryId: string): Promise<Category | null> {
  if (!ObjectId.isValid(categoryId)) return null;
  const document = await (await collection()).findOne({ _id: new ObjectId(categoryId) });
  return document ? toCategory(document) : null;
}

/** Slug comes from the label and is unique ("postre", "postre-2", …). It never changes afterwards. */
async function buildUniqueSlug(label: string): Promise<string> {
  const base = slugify(label) || 'categoria';
  const categories = await collection();
  let slug = base;
  for (let suffix = 2; await categories.findOne({ slug }); suffix += 1) slug = `${base}-${suffix}`;
  return slug;
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  const categories = await collection();
  const last = await categories.find().sort({ sortOrder: -1 }).limit(1).next();
  const document: CategoryDocument = {
    _id: new ObjectId(),
    slug: await buildUniqueSlug(input.label),
    label: input.label,
    tagline: input.tagline,
    sortOrder: (last?.sortOrder ?? 0) + 1,
  };
  await categories.insertOne(document);
  return toCategory(document);
}

export async function updateCategory(categoryId: string, input: CategoryInput): Promise<boolean> {
  const result = await (await collection()).updateOne(
    { _id: new ObjectId(categoryId) },
    { $set: { label: input.label, tagline: input.tagline } },
  );
  return result.matchedCount === 1;
}

export async function deleteCategory(categoryId: string): Promise<boolean> {
  const result = await (await collection()).deleteOne({ _id: new ObjectId(categoryId) });
  return result.deletedCount === 1;
}

/** Swap positions with the neighbour above (-1) or below (+1). */
export async function moveCategory(categoryId: string, direction: -1 | 1): Promise<void> {
  const ordered = await listCategories();
  const index = ordered.findIndex((category) => category.id === categoryId);
  const neighbour = ordered[index + direction];
  if (index === -1 || !neighbour) return;
  const categories = await collection();
  await categories.updateOne({ _id: new ObjectId(categoryId) }, { $set: { sortOrder: neighbour.sortOrder } });
  await categories.updateOne({ _id: new ObjectId(neighbour.id) }, { $set: { sortOrder: ordered[index].sortOrder } });
}
