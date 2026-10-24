'use client';

import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  return (
    <div className="page-fade-in">
      <PageHeader
        title="Productos"
        subtitle={products.length === 1 ? '1 producto en el menú' : `${products.length} productos en el menú`}
        info={<InfoSheet {...PRODUCTS_INFO} />}
        action={
          ctx.hasCategories && (
            <button type="button" className={`${forms.primaryButton} ${styles.newButton}`} onClick={ctx.openNewProduct}>
              <span className="material-symbols-outlined">add</span>
              Nuevo producto
            </button>
          )
        }
      />

      {ctx.hasCategories ? (
        <>
          {ctx.sections.map((section) => (
            <ProductSection key={section.category.id} section={section} ctx={ctx} />
          ))}
        </>
      ) : (
        <EmptyState icon="category" title="Aún no hay categorías" text="Crea una categoría para empezar a agregar productos." actionLabel="Crear categoría" onAction={() => router.push('/categorias')} />
      )}

      <ProductActionsSheet ctx={ctx} />
      <ProductFormSheet open={ctx.isFormOpen} product={ctx.formProduct} formKey={ctx.formKey} categories={categories} onClose={ctx.closeForm} />
      <ConfirmSheet
        open={ctx.isDeleteOpen}
        title={`¿Eliminar "${ctx.selected?.name ?? ''}"?`}
        message="Desaparece del menú y no se puede deshacer. Si solo se agotó, mejor usa «Ocultar del menú»."
        confirmLabel="Eliminar producto"
        isWorking={ctx.isWorking}
        error={ctx.actionError}
        onConfirm={() => void ctx.confirmDelete()}
        onCancel={ctx.closeDelete}
      />
    </div>
  );
}
