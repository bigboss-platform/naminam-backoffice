'use client';

import { DropdownMenu } from '@/features/core/components/DropdownMenu.component';
import { isDesktop } from '@/features/core/config/breakpoints.constants';
import { formatMenuPrice } from '@/features/core/utils/format.util';
import type { ProductsPageCtx } from '../hooks/useProductsPage.hook';
import type { Product } from '../types/Product.type';
import { getProductActions } from '../utils/productActions.util';
import { ProductMedia } from './ProductMedia.component';
import styles from './ProductRow.module.css';

/**
 * Tappable card row. Mobile: anywhere → actions sheet. Desktop: the photo → modal with the
 * big photo + actions; the rest of the row → dropdown with the same actions.
 */
export function ProductRow({ product, index, ctx }: { product: Product; index: number; ctx: ProductsPageCtx }) {
  const isMenuOpen = ctx.menuProductId === product.id;

  const onClick = (event: React.MouseEvent) => {
    const isDesktopView = isDesktop();
    const isPhoto = (event.target as HTMLElement).closest('[data-row-photo]') !== null;
    if (isDesktopView && !isPhoto) ctx.toggleMenu(product);
    else ctx.openActions(product);
  };

  return (
    <div className={`${styles.wrap} ${isMenuOpen ? styles.wrapMenuOpen : ''} stagger-in`} style={{ '--i': index } as React.CSSProperties}>
      <button
        type="button"
        className={`${styles.row} ${product.isAvailable ? '' : styles.rowHidden}`}
        onClick={onClick}
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
      >
        <span className={styles.thumb} data-row-photo>
          <ProductMedia
            mediaType={product.mediaType}
            mediaUrl={product.mediaUrl}
            posterUrl={product.posterUrl}
            alt={product.name}
            isLive={false}
            sizes="64px"
          />
        </span>
        <span className={styles.text}>
          <span className={`${styles.name} font-display`}>{product.name}</span>
          <span className={styles.chips}>
            {!product.isAvailable && <span className={`${styles.chip} ${styles.chipMuted}`}>Oculto</span>}
            {product.isFeatured && (
              <span className={styles.chip}>
                <span className="material-symbols-outlined icon-filled">star</span>
                Favorito
              </span>
            )}
            {product.mediaType === 'video' && product.mediaUrl && <span className={styles.chip}>Video</span>}
            {!product.mediaUrl && <span className={`${styles.chip} ${styles.chipWarning}`}>Sin foto</span>}
          </span>
        </span>
        <span className={styles.price}>{formatMenuPrice(product.price)}</span>
      </button>
      {isMenuOpen && (
        <DropdownMenu isOpen onClose={ctx.closeMenu} label={product.name} items={getProductActions(ctx)} />
      )}
    </div>
  );
}
