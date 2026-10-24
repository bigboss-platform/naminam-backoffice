import { WhatsAppIcon } from '@/features/core/components/BrandIcons.component';
import { formatMenuPrice } from '@/features/core/utils/format.util';
import type { ProductInput } from '../types/Product.type';
import { ProductMedia } from './ProductMedia.component';
import styles from './ProductPreview.module.css';

/**
 * The dessert card exactly as the public menu shows it (mirrors landing-app
 * MenuItemCard: full-width 4:3 photo, badge, name, 2-line description, note +
 * price + WhatsApp button). Videos play muted in a loop, like they will on the menu.
 */
export function ProductPreview({ input }: { input: ProductInput }) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.caption}>Así se verá en el menú</p>
      <article className={styles.card}>
        <div className={styles.media}>
          <ProductMedia
            mediaType={input.mediaType}
            mediaUrl={input.mediaUrl.trim()}
            posterUrl={input.posterUrl.trim()}
            alt={input.name || 'Vista previa'}
            isLive
            sizes="360px"
          />
          {input.badge.trim() && <span className={styles.badge}>{input.badge.trim()}</span>}
        </div>
        <div className={styles.body}>
          <h3 className={`${styles.name} font-display`}>{input.name.trim() || 'Nombre del producto'}</h3>
          <p className={styles.description}>{input.description.trim() || 'Descripción del producto'}</p>
          <div className={styles.footer}>
            <span className={styles.note}>{input.isAddOn ? 'Complemento' : input.note.trim()}</span>
            <span className={styles.priceGroup}>
              <span className={styles.price}>{formatMenuPrice(input.price)}</span>
              <span className={styles.whatsappButton} aria-hidden="true">
                <WhatsAppIcon size={24} />
              </span>
            </span>
          </div>
        </div>
      </article>
    </div>
  );
}
