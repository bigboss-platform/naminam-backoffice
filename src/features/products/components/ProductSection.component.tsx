import type { ProductSectionData } from '../hooks/useProductsPage.hook';
import type { Product } from '../types/Product.type';
import { ProductRow } from './ProductRow.component';
import styles from './ProductSection.module.css';

type ProductSectionProps = {
  section: ProductSectionData;
  onOpenProduct: (product: Product) => void;
};

export function ProductSection({ section, onOpenProduct }: ProductSectionProps) {
  const { category, products } = section;
  return (
    <section className={styles.section} aria-labelledby={`category-${category.id}`}>
      <h2 id={`category-${category.id}`} className={`${styles.title} font-display`}>
        {category.label}
      </h2>
      {products.length === 0 ? (
        <p className={styles.empty}>Sin postres en esta categoría.</p>
      ) : (
        <div className={styles.list}>
          {products.map((product, index) => (
            <ProductRow key={product.id} product={product} index={index} onOpen={() => onOpenProduct(product)} />
          ))}
        </div>
      )}
    </section>
  );
}
