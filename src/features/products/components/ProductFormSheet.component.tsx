'use client';

import { BottomSheet } from '@/features/core/components/BottomSheet.component';
import forms from '@/features/core/components/forms.module.css';
import { useProductForm } from '../hooks/useProductForm.hook';
import type { Category } from '../types/Category.type';
import type { Product } from '../types/Product.type';
import { ProductBasicsFields } from './ProductBasicsFields.component';
import { ProductExtrasFields } from './ProductExtrasFields.component';
import { ProductMediaFields } from './ProductMediaFields.component';

type ProductFormSheetProps = {
  open: boolean;
  /** null = create a new dessert. */
  product: Product | null;
  /** Changes every time the sheet opens → the form starts fresh. */
  formKey: number;
  categories: Category[];
  onClose: () => void;
};

/** Create/edit a dessert in a bottom sheet (workspace rule: no inline forms). */
export function ProductFormSheet({ open, product, formKey, categories, onClose }: ProductFormSheetProps) {
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={product ? 'Editar postre' : 'Nuevo postre'}
      subtitle={product?.name ?? ''}
    >
      <ProductForm key={formKey} product={product} categories={categories} onSaved={onClose} />
    </BottomSheet>
  );
}

function ProductForm({ product, categories, onSaved }: { product: Product | null; categories: Category[]; onSaved: () => void }) {
  const ctx = useProductForm(product, categories.map((category) => category.slug), onSaved);

  return (
    <form
      className={forms.form}
      onSubmit={(event) => {
        event.preventDefault();
        void ctx.save();
      }}
    >
      <ProductBasicsFields ctx={ctx} categories={categories} />
      <ProductMediaFields ctx={ctx} />
      <ProductExtrasFields ctx={ctx} />
      {ctx.saveError && <p className={forms.formError}>{ctx.saveError}</p>}
      {/* Only rendered when every required field is valid — never disabled (workspace rule) */}
      {ctx.isComplete && (
        <button type="submit" className={forms.primaryButton}>
          {ctx.isSaving ? 'Guardando…' : ctx.isEditing ? 'Guardar cambios' : 'Crear postre'}
        </button>
      )}
    </form>
  );
}
