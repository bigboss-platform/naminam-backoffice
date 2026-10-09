'use client';

import { BottomSheet } from '@/features/core/components/BottomSheet.component';
import { ConfirmSheet } from '@/features/core/components/ConfirmSheet.component';
import forms from '@/features/core/components/forms.module.css';
import { SheetActions, type SheetActionItem } from '@/features/core/components/SheetActions.component';
import type { CategoriesManagerCtx } from '../hooks/useCategoriesManager.hook';
import { CategoryFormSheet } from './CategoryFormSheet.component';
import styles from './CategoriesSection.module.css';

/** "Categorías" section at the bottom of Productos: list + "+" + per-row actions. */
export function CategoriesSection({ ctx }: { ctx: CategoriesManagerCtx }) {
  const { categories, productCountBySlug, selected, error } = ctx;

  const actions: SheetActionItem[] = [
    { id: 'edit', icon: 'edit', label: 'Editar', onSelect: ctx.editSelected },
    ...(ctx.canMoveUp ? [{ id: 'up', icon: 'arrow_upward', label: 'Subir en el menú', onSelect: () => ctx.move(-1) }] : []),
    ...(ctx.canMoveDown ? [{ id: 'down', icon: 'arrow_downward', label: 'Bajar en el menú', onSelect: () => ctx.move(1) }] : []),
    { id: 'delete', icon: 'delete', label: 'Eliminar', onSelect: ctx.askDeleteSelected, isDanger: true },
  ];

  return (
    <section className={styles.section} aria-labelledby="categories-title">
      <div className={styles.header}>
        <h2 id="categories-title" className={`${styles.title} font-display`}>Categorías</h2>
        <button type="button" className={styles.addButton} onClick={ctx.openNewCategory} aria-label="Agregar categoría">
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>
      <div className={styles.list}>
        {categories.map((category) => (
          <button key={category.id} type="button" className={styles.row} onClick={() => ctx.openActions(category)}>
            <span className={styles.rowText}>
              <span className={styles.rowLabel}>{category.label}</span>
              <span className={styles.rowMeta}>
                {productCountBySlug[category.slug] ?? 0} postres{category.tagline ? ` · ${category.tagline}` : ''}
              </span>
            </span>
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        ))}
      </div>

      <BottomSheet open={ctx.isActionsOpen} onClose={ctx.closeActions} title={selected?.label ?? ''} subtitle={selected?.tagline ?? ''}>
        {error && <p className={forms.formError}>{error}</p>}
        <SheetActions actions={actions} />
      </BottomSheet>
      <CategoryFormSheet open={ctx.isFormOpen} category={ctx.formCategory} formKey={ctx.formKey} onClose={ctx.closeForm} />
      <ConfirmSheet
        open={ctx.isDeleteOpen}
        title={`¿Eliminar "${selected?.label ?? ''}"?`}
        message="Solo se puede eliminar si no tiene postres. Esta acción no se puede deshacer."
        confirmLabel="Eliminar categoría"
        isWorking={ctx.isWorking}
        error={error}
        onConfirm={ctx.confirmDelete}
        onCancel={ctx.closeDelete}
      />
    </section>
  );
}
