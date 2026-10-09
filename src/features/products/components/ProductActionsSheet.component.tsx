'use client';

import { BottomSheet } from '@/features/core/components/BottomSheet.component';
import forms from '@/features/core/components/forms.module.css';
import { SheetActions } from '@/features/core/components/SheetActions.component';
import { formatMenuPrice } from '@/features/core/utils/format.util';
import type { ProductsPageCtx } from '../hooks/useProductsPage.hook';

/** Tap a dessert → edit, hide/show on the menu, add/remove from favourites, delete. */
export function ProductActionsSheet({ ctx }: { ctx: ProductsPageCtx }) {
  const { selected, isActionsOpen, closeActions, editSelected, askDeleteSelected, toggleFlag, actionError, isWorking } = ctx;
  if (!selected) return null;

  return (
    <BottomSheet
      open={isActionsOpen}
      onClose={closeActions}
      title={selected.name}
      subtitle={`${formatMenuPrice(selected.price)}${selected.isAvailable ? '' : ' · Oculto en el menú'}`}
    >
      {actionError && <p className={forms.formError}>{actionError}</p>}
      {isWorking && <p className={forms.label}>Guardando…</p>}
      <SheetActions
        actions={[
          { id: 'edit', icon: 'edit', label: 'Editar', onSelect: editSelected },
          {
            id: 'availability',
            icon: selected.isAvailable ? 'visibility_off' : 'visibility',
            label: selected.isAvailable ? 'Ocultar del menú' : 'Mostrar en el menú',
            onSelect: () => void toggleFlag('isAvailable'),
          },
          {
            id: 'featured',
            icon: 'star',
            label: selected.isFeatured ? 'Quitar de "Nuestros favoritos"' : 'Agregar a "Nuestros favoritos"',
            onSelect: () => void toggleFlag('isFeatured'),
          },
          { id: 'delete', icon: 'delete', label: 'Eliminar', onSelect: askDeleteSelected, isDanger: true },
        ]}
      />
    </BottomSheet>
  );
}
