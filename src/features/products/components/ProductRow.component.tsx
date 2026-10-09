import { formatMenuPrice } from '@/features/core/utils/format.util';
import type { Product } from '../types/Product.type';
import { ProductMedia } from './ProductMedia.component';
import styles from './ProductRow.module.css';

/** Tappable card row → actions sheet (workspace pattern: no 3-dots dropdown). */
export function ProductRow({ product, index, onOpen }: { product: Product; index: number; onOpen: () => void }) {
  return (
    <button
      type="button"
      className={`${styles.row} ${product.isAvailable ? '' : styles.rowHidden} stagger-in`}
      style={{ '--i': index } as React.CSSProperties}
      onClick={onOpen}
    >
      <span className={styles.thumb}>
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
      <span className={`material-symbols-outlined ${styles.chevron}`}>chevron_right</span>
    </button>
  );
}
