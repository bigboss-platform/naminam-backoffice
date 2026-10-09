import type { Metadata } from 'next';
import { ProductsContainer } from '@/features/products/containers/ProductsContainer.container';
import { requirePageSession } from '@/server/auth/dal';
import { listCategories } from '@/server/repositories/categories.repository';
import { listProducts } from '@/server/repositories/products.repository';

export const metadata: Metadata = { title: 'Productos' };

export default async function ProductsPage() {
  await requirePageSession();
  const [products, categories] = await Promise.all([listProducts(), listCategories()]);
  return <ProductsContainer products={products} categories={categories} />;
}
