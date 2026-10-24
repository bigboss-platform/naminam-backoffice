'use client';

import { FormField } from '@/features/core/components/FormField.component';
import forms from '@/features/core/components/forms.module.css';
import { KeypadField } from '@/features/core/components/KeypadField.component';
import { PillChoice } from '@/features/core/components/PillChoice.component';
import { centsDigitsToAmount, formatMoneyInput } from '@/features/core/utils/format.util';
import type { ProductFormCtx } from '../hooks/useProductForm.hook';
import type { Category } from '../types/Category.type';
import { PRODUCT_LIMITS } from '../utils/product.validation';

/** Name, category, price and description — the required fields. */
export function ProductBasicsFields({ ctx, categories }: { ctx: ProductFormCtx; categories: Category[] }) {
  const { input, setText, update, touch, errorFor, priceDigits, setPriceDigits } = ctx;
  const categoryOptions = categories.map((category) => ({ value: category.slug, label: category.label }));

  return (
    <>
      <FormField label="¿Cómo se llama el producto?" htmlFor="product-name" error={errorFor('name')}>
        <input
          id="product-name"
          className={forms.input}
          value={input.name}
          maxLength={PRODUCT_LIMITS.nameMax}
          placeholder="Ej. Cheesecake de Fresa"
          onChange={(event) => setText('name', event.target.value)}
          onBlur={() => touch('name')}
        />
      </FormField>

      <FormField label="¿En qué categoría va?" error={errorFor('categoryId')}>
        <PillChoice
          ariaLabel="Categoría"
          options={categoryOptions}
          value={input.categoryId}
          onChange={(value) => {
            update('categoryId', value);
            touch('categoryId');
          }}
        />
      </FormField>

      <FormField label="¿Cuánto cuesta?" htmlFor="product-price" error={errorFor('price')}>
        <KeypadField
          id="product-price"
          digits={priceDigits}
          onChange={setPriceDigits}
          maxDigits={6}
          stripLeadingZeros
          formatDisplay={(digits) => formatMoneyInput(centsDigitsToAmount(digits))}
          keyboardLabel="Precio (los últimos 2 dígitos son los céntimos)"
          prefix="S/"
          placeholder="0,00"
          onDone={() => touch('price')}
        />
      </FormField>

      <FormField label="¿Cómo lo describirías?" htmlFor="product-description" error={errorFor('description')}>
        <textarea
          id="product-description"
          className={forms.textarea}
          value={input.description}
          maxLength={PRODUCT_LIMITS.descriptionMax}
          placeholder="Ej. Cremoso y horneado lentamente, con compota de fresas."
          onChange={(event) => setText('description', event.target.value)}
          onBlur={() => touch('description')}
        />
      </FormField>
    </>
  );
}
