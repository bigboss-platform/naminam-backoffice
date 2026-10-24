import type { SheetActionItem } from '@/features/core/components/SheetActions.component';
import type { ProductsPageCtx } from '../hooks/useProductsPage.hook';

/** Same actions for the mobile sheet / desktop photo modal and the desktop row dropdown. */
export function getProductActions(ctx: ProductsPageCtx): SheetActionItem[] {
  const { selected, editSelected, askDeleteSelected, toggleFlag } = ctx;
  if (!selected) return [];
  return [
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
      label: selected.isFeatured ? 'Quitar de "Los consentidos de la casa"' : 'Agregar a "Los consentidos de la casa"',
      onSelect: () => void toggleFlag('isFeatured'),
    },
    { id: 'delete', icon: 'delete', label: 'Eliminar', onSelect: askDeleteSelected, isDanger: true },
  ];
}
