import type { SheetActionItem } from '@/features/core/components/SheetActions.component';
import type { CategoriesManagerCtx } from '../hooks/useCategoriesManager.hook';

/** Same actions for the mobile sheet and the desktop row dropdown. */
export function getCategoryActions(ctx: CategoriesManagerCtx): SheetActionItem[] {
  return [
    { id: 'edit', icon: 'edit', label: 'Editar', onSelect: ctx.editSelected },
    ...(ctx.canMoveUp ? [{ id: 'up', icon: 'arrow_upward', label: 'Subir en el menú', onSelect: () => ctx.move(-1) }] : []),
    ...(ctx.canMoveDown ? [{ id: 'down', icon: 'arrow_downward', label: 'Bajar en el menú', onSelect: () => ctx.move(1) }] : []),
    { id: 'delete', icon: 'delete', label: 'Eliminar', onSelect: ctx.askDeleteSelected, isDanger: true },
  ];
}
