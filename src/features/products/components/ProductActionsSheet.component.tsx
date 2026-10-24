'use client';

import { BottomSheet } from '@/features/core/components/BottomSheet.component';
import forms from '@/features/core/components/forms.module.css';
import { SheetActions } from '@/features/core/components/SheetActions.component';
import { formatMenuPrice } from '@/features/core/utils/format.util';
import type { ProductsPageCtx } from '../hooks/useProductsPage.hook';
import { getProductActions } from '../utils/productActions.util';
import { ProductMedia } from './ProductMedia.component';
import styles from './ProductActionsSheet.module.css';

/** Mobile: tap a dessert. Desktop: tap its photo. Big photo first, then the actions. */
export function ProductActionsSheet({ ctx }: { ctx: ProductsPageCtx }) {
  const { selected, isActionsOpen, closeActions, actionError, isWorking } = ctx;
  if (!selected) return null;

  return (
    <BottomSheet
      open={isActionsOpen}
      onClose={closeActions}
      title={selected.name}
      subtitle={`${formatMenuPrice(selected.price)}${selected.isAvailable ? '' : ' · Oculto en el menú'}`}
      media={
        selected.mediaUrl ? (
          <div className={styles.photo}>
            <ProductMedia
              mediaType={selected.mediaType}
              mediaUrl={selected.mediaUrl}
              posterUrl={selected.posterUrl}
              alt={selected.name}
              isLive
              sizes="(min-width: 768px) 560px, 100vw"
            />
          </div>
        ) : undefined
      }
    >
      {actionError && <p className={forms.formError}>{actionError}</p>}
      {isWorking && <p className={forms.label}>Guardando…</p>}
      <SheetActions actions={getProductActions(ctx)} />
    </BottomSheet>
  );
}
