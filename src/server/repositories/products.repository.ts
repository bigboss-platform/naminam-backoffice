import 'server-only';
import { ObjectId } from 'mongodb';
import { slugify } from '@/features/core/utils/format.util';
import type { Product, ProductInput } from '@/features/products/types/Product.type';
import { COLLECTIONS, getDb } from '../db/mongo';

type ProductDocument = Omit<Product, 'id' | 'updatedAt'> & { _id: ObjectId; createdAt: Date; updatedAt: Date };

function toProduct({ _id, createdAt, updatedAt, ...rest }: ProductDocument): Product {
  void createdAt;
  return { ...rest, id: _id.toHexString(), updatedAt: updatedAt.toISOString() };
}

async function collection() {
  return (await getDb()).collection<ProductDocument>(COLLECTIONS.products);
}

export async function listProducts(): Promise<Product[]> {
  const documents = await (await collection()).find().sort({ sortOrder: 1 }).toArray();
  return documents.map(toProduct);
}

export async function countProductsInCategory(categorySlug: string): Promise<number> {
  return (await collection()).countDocuments({ categoryId: categorySlug });
}

/** Slug from the name, unique; kept stable on rename so public links (/menu#slug) don't break. */
async function buildUniqueSlug(name: string): Promise<string> {
  const base = slugify(name) || 'postre';
  const products = await collection();
  let slug = base;
  for (let suffix = 2; await products.findOne({ slug }); suffix += 1) slug = `${base}-${suffix}`;
  return slug;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const products = await collection();
  const last = await products.find().sort({ sortOrder: -1 }).limit(1).next();
  const now = new Date();
  const document: ProductDocument = {
    ...input,
    _id: new ObjectId(),
    slug: await buildUniqueSlug(input.name),
    sortOrder: (last?.sortOrder ?? 0) + 1,
    createdAt: now,
    updatedAt: now,
  };
  await products.insertOne(document);
  return toProduct(document);
}

export async function updateProduct(productId: string, input: ProductInput): Promise<boolean> {
  const result = await (await collection()).updateOne(
    { _id: new ObjectId(productId) },
    { $set: { ...input, updatedAt: new Date() } },
  );
  return result.matchedCount === 1;
}

export async function setProductFlag(
  productId: string,
  flag: 'isAvailable' | 'isFeatured',
  value: boolean,
): Promise<boolean> {
  const result = await (await collection()).updateOne(
    { _id: new ObjectId(productId) },
    { $set: { [flag]: value, updatedAt: new Date() } },
  );
  return result.matchedCount === 1;
}

export async function deleteProduct(productId: string): Promise<boolean> {
  const result = await (await collection()).deleteOne({ _id: new ObjectId(productId) });
  return result.deletedCount === 1;
}
