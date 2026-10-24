import type { Metadata } from 'next';
import { CategoriesContainer } from '@/features/categories/containers/CategoriesContainer.container';
import { requirePageSession } from '@/server/auth/dal';
import { listCategories } from '@/server/repositories/categories.repository';
import { listProducts } from '@/server/repositories/products.repository';

export const metadata: Metadata = { title: 'Categorías' };

export default async function CategoriesPage() {
  await requirePageSession();
  const [products, categories] = await Promise.all([listProducts(), listCategories()]);
  const productCountBySlug: Record<string, number> = {};
  for (const product of products) {
    productCountBySlug[product.categoryId] = (productCountBySlug[product.categoryId] ?? 0) + 1;
  }
  return <CategoriesContainer categories={categories} productCountBySlug={productCountBySlug} />;
}
