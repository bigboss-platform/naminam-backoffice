'use client';

import { BottomSheet } from '@/features/core/components/BottomSheet.component';
import { ConfirmSheet } from '@/features/core/components/ConfirmSheet.component';
import { EmptyState } from '@/features/core/components/EmptyState.component';
import forms from '@/features/core/components/forms.module.css';
import { InfoSheet } from '@/features/core/components/InfoSheet.component';
import { PageHeader } from '@/features/core/components/PageHeader.component';
import { SheetActions } from '@/features/core/components/SheetActions.component';
import type { Category } from '@/features/products/types/Category.type';
import { CategoryFormSheet } from '../components/CategoryFormSheet.component';
import { CategoryRow } from '../components/CategoryRow.component';
import { CATEGORIES_INFO } from '../config/categoriesInfo.constants';
import { useCategoriesManager } from '../hooks/useCategoriesManager.hook';
import { getCategoryActions } from '../utils/categoryActions.util';
import styles from './CategoriesContainer.module.css';

type CategoriesContainerProps = { categories: Category[]; productCountBySlug: Record<string, number> };

/** Categorías page — same rules as Productos (sheet on mobile, dropdown on desktop). */
export function CategoriesContainer({ categories, productCountBySlug }: CategoriesContainerProps) {
  const ctx = useCategoriesManager(categories, productCountBySlug);
  const { selected, error } = ctx;

  return (
    <div className="page-fade-in">
      <PageHeader
        title="Categorías"
        subtitle={categories.length === 1 ? '1 categoría en el menú' : `${categories.length} categorías en el menú`}
        info={<InfoSheet {...CATEGORIES_INFO} />}
        action={
          categories.length > 0 && (
            <button type="button" className={`${forms.primaryButton} ${styles.newButton}`} onClick={ctx.openNewCategory}>
              <span className="material-symbols-outlined">add</span>
              Nueva categoría
            </button>
          )
        }
      />

      {categories.length === 0 ? (
        <EmptyState icon="category" title="Aún no hay categorías" text="Crea una para empezar a agregar productos." actionLabel="Crear categoría" onAction={ctx.openNewCategory} />
      ) : (
        <div className={styles.list}>
          {categories.map((category, index) => (
            <CategoryRow key={category.id} category={category} index={index} ctx={ctx} />
          ))}
        </div>
      )}

      <BottomSheet open={ctx.isActionsOpen} onClose={ctx.closeActions} title={selected?.label ?? ''} subtitle={selected?.tagline ?? ''}>
        {error && <p className={forms.formError}>{error}</p>}
        <SheetActions actions={getCategoryActions(ctx)} />
      </BottomSheet>
      <CategoryFormSheet open={ctx.isFormOpen} category={ctx.formCategory} formKey={ctx.formKey} onClose={ctx.closeForm} />
      <ConfirmSheet
        open={ctx.isDeleteOpen}
        title={`¿Eliminar "${selected?.label ?? ''}"?`}
        message="Solo se puede eliminar si no tiene productos. Esta acción no se puede deshacer."
        confirmLabel="Eliminar categoría"
        isWorking={ctx.isWorking}
        error={error}
        onConfirm={ctx.confirmDelete}
        onCancel={ctx.closeDelete}
      />
    </div>
  );
}
