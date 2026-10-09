'use client';

import { CategoriesSection } from '@/features/categories/components/CategoriesSection.component';
import { useCategoriesManager } from '@/features/categories/hooks/useCategoriesManager.hook';
import { ConfirmSheet } from '@/features/core/components/ConfirmSheet.component';
import { EmptyState } from '@/features/core/components/EmptyState.component';
import forms from '@/features/core/components/forms.module.css';
import { InfoSheet } from '@/features/core/components/InfoSheet.component';
import { PageHeader } from '@/features/core/components/PageHeader.component';
import { ProductActionsSheet } from '../components/ProductActionsSheet.component';
import { ProductFormSheet } from '../components/ProductFormSheet.component';
import { ProductSection } from '../components/ProductSection.component';
import { PRODUCTS_INFO } from '../config/productsInfo.constants';
import { useProductsPage } from '../hooks/useProductsPage.hook';
import type { Category } from '../types/Category.type';
import type { Product } from '../types/Product.type';
import styles from './ProductsContainer.module.css';

export function ProductsContainer({ products, categories }: { products: Product[]; categories: Category[] }) {
  const ctx = useProductsPage(products, categories);
  const productCountBySlug = Object.fromEntries(ctx.sections.map((section) => [section.category.slug, section.products.length]));
  const categoriesCtx = useCategoriesManager(categories, productCountBySlug);

  return (
    <div className="page-fade-in">
      <PageHeader title="Productos" subtitle={`${products.length} postres en el menú`} info={<InfoSheet {...PRODUCTS_INFO} />} />

      {ctx.hasCategories ? (
        <>
          <button type="button" className={`${forms.primaryButton} ${styles.newButton}`} onClick={ctx.openNewProduct}>
            <span className="material-symbols-outlined">add</span>
            Nuevo postre
          </button>
          {ctx.sections.map((section) => (
            <ProductSection key={section.category.id} section={section} onOpenProduct={ctx.openActions} />
          ))}
        </>
      ) : (
        <EmptyState icon="category" title="Aún no hay categorías" text="Crea una categoría para empezar a agregar postres." actionLabel="Crear categoría" onAction={categoriesCtx.openNewCategory} />
      )}

      <CategoriesSection ctx={categoriesCtx} />

      <ProductActionsSheet ctx={ctx} />
      <ProductFormSheet open={ctx.isFormOpen} product={ctx.formProduct} formKey={ctx.formKey} categories={categories} onClose={ctx.closeForm} />
      <ConfirmSheet
        open={ctx.isDeleteOpen}
        title={`¿Eliminar "${ctx.selected?.name ?? ''}"?`}
        message="Desaparece del menú y no se puede deshacer. Si solo se agotó, mejor usa «Ocultar del menú»."
        confirmLabel="Eliminar postre"
        isWorking={ctx.isWorking}
        error={ctx.actionError}
        onConfirm={() => void ctx.confirmDelete()}
        onCancel={ctx.closeDelete}
      />
    </div>
  );
}
