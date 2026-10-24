import type { ProductSectionData, ProductsPageCtx } from '../hooks/useProductsPage.hook';
import { ProductRow } from './ProductRow.component';
import styles from './ProductSection.module.css';

type ProductSectionProps = {
  section: ProductSectionData;
  ctx: ProductsPageCtx;
};

export function ProductSection({ section, ctx }: ProductSectionProps) {
  const { category, products } = section;
  return (
    <section className={styles.section} aria-labelledby={`category-${category.id}`}>
      <h2 id={`category-${category.id}`} className={`${styles.title} font-display`}>
        {category.label}
        <span className={styles.count} aria-label={`${products.length} productos`}>{products.length}</span>
      </h2>
      {products.length === 0 ? (
        <p className={styles.empty}>Sin productos en esta categoría.</p>
      ) : (
        <div className={styles.list}>
          {products.map((product, index) => (
            <ProductRow key={product.id} product={product} index={index} ctx={ctx} />
          ))}
        </div>
      )}
    </section>
  );
}
