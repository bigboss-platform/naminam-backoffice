'use client';

import { BottomSheet } from '@/features/core/components/BottomSheet.component';
import forms from '@/features/core/components/forms.module.css';
import { useProductForm } from '../hooks/useProductForm.hook';
import type { Category } from '../types/Category.type';
import type { Product } from '../types/Product.type';
import { ProductBasicsFields } from './ProductBasicsFields.component';
import { ProductExtrasFields } from './ProductExtrasFields.component';
import { ProductMediaFields } from './ProductMediaFields.component';
import { ProductPreview } from './ProductPreview.component';
import styles from './ProductFormSheet.module.css';

type ProductFormSheetProps = {
  open: boolean;
  /** null = create a new dessert. */
  product: Product | null;
  /** Changes every time the sheet opens → the form starts fresh. */
  formKey: number;
  categories: Category[];
  onClose: () => void;
};

/** Create/edit a dessert (drawer on mobile, wide modal on desktop) with a live card preview. */
export function ProductFormSheet({ open, product, formKey, categories, onClose }: ProductFormSheetProps) {
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={product ? 'Editar postre' : 'Nuevo postre'}
      subtitle={product?.name ?? ''}
      size="wide"
    >
      <ProductForm key={formKey} product={product} categories={categories} onSaved={onClose} />
    </BottomSheet>
  );
}

/**
 * Field order follows the menu card top → bottom: photo, name, category, price,
 * description, optional details, then the yes/no options. The preview updates live.
 * Mobile: preview first. Desktop: fields left, sticky preview right.
 */
function ProductForm({ product, categories, onSaved }: { product: Product | null; categories: Category[]; onSaved: () => void }) {
  const ctx = useProductForm(product, categories.map((category) => category.slug), onSaved);

  return (
    <form
      className={styles.layout}
      onSubmit={(event) => {
        event.preventDefault();
        void ctx.save();
      }}
    >
      <aside className={styles.preview}>
        <ProductPreview input={ctx.previewInput} />
      </aside>
      <div className={`${forms.form} ${styles.fields}`}>
        <ProductMediaFields ctx={ctx} />
        <ProductBasicsFields ctx={ctx} categories={categories} />
        <ProductExtrasFields ctx={ctx} />
        {ctx.saveError && <p className={forms.formError}>{ctx.saveError}</p>}
        {/* Only rendered when every required field is valid — never disabled (workspace rule) */}
        {ctx.isComplete && (
          <button type="submit" className={forms.primaryButton}>
            {ctx.isSaving ? 'Guardando…' : ctx.isEditing ? 'Guardar cambios' : 'Crear postre'}
          </button>
        )}
      </div>
    </form>
  );
}
