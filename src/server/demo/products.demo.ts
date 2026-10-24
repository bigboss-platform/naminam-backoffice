import 'server-only';
import { slugify } from '@/features/core/utils/format.util';
import type { Product, ProductInput } from '@/features/products/types/Product.type';
import { getDemoStore, newDemoId, uniqueSlug } from './demoStore';

/** Same API as repositories/mongo/products.mongo.ts, in memory (DEMO MODE). */

export async function listProducts(): Promise<Product[]> {
  return [...getDemoStore().products].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function countProductsInCategory(categorySlug: string): Promise<number> {
  return getDemoStore().products.filter((product) => product.categoryId === categorySlug).length;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const store = getDemoStore();
  const product: Product = {
    ...input,
    id: newDemoId(),
    slug: uniqueSlug(slugify(input.name) || 'producto', store.products.map((item) => item.slug)),
    sortOrder: Math.max(0, ...store.products.map((item) => item.sortOrder)) + 1,
    updatedAt: new Date().toISOString(),
  };
  store.products.push(product);
  return product;
}

export async function updateProduct(productId: string, input: ProductInput): Promise<boolean> {
  const product = getDemoStore().products.find((item) => item.id === productId);
  if (!product) return false;
  Object.assign(product, input, { updatedAt: new Date().toISOString() });
  return true;
}

export async function setProductFlag(productId: string, flag: 'isAvailable' | 'isFeatured', value: boolean): Promise<boolean> {
  const product = getDemoStore().products.find((item) => item.id === productId);
  if (!product) return false;
  product[flag] = value;
  product.updatedAt = new Date().toISOString();
  return true;
}

export async function deleteProduct(productId: string): Promise<boolean> {
  const store = getDemoStore();
  const before = store.products.length;
  store.products = store.products.filter((item) => item.id !== productId);
  return store.products.length < before;
}
