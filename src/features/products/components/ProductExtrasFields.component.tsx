'use client';

import { FormField } from '@/features/core/components/FormField.component';
import forms from '@/features/core/components/forms.module.css';
import { PillChoice, YES_NO_OPTIONS } from '@/features/core/components/PillChoice.component';
import type { ProductFormCtx } from '../hooks/useProductForm.hook';
import { PRODUCT_LIMITS } from '../utils/product.validation';

type FlagName = 'isAvailable' | 'isFeatured' | 'isAddOn';

const FLAG_QUESTIONS: { flag: FlagName; question: string }[] = [
  { flag: 'isAvailable', question: '¿Lo mostramos en el menú?' },
  { flag: 'isFeatured', question: '¿Va en "Los consentidos de la casa" del inicio?' },
  { flag: 'isAddOn', question: '¿Es un acompañante de otros productos?' },
];

/** Optional details + yes/no switches as pills (workspace rule: pills, never checkboxes). */
export function ProductExtrasFields({ ctx }: { ctx: ProductFormCtx }) {
  const { input, setText, update, touch, errorFor } = ctx;

  return (
    <>
      <FormField label="¿Qué lo hace especial, en pocas palabras?" htmlFor="product-note" isOptional error={errorFor('note')}>
        <input
          id="product-note"
          className={forms.input}
          value={input.note}
          maxLength={PRODUCT_LIMITS.noteMax}
          placeholder="Ej. Chocolate intenso"
          onChange={(event) => setText('note', event.target.value)}
          onBlur={() => touch('note')}
        />
      </FormField>

      <FormField label="¿Lleva alguna etiqueta sobre la foto?" htmlFor="product-badge" isOptional error={errorFor('badge')}>
        <input
          id="product-badge"
          className={forms.input}
          value={input.badge}
          maxLength={PRODUCT_LIMITS.badgeMax}
          placeholder="Ej. Favorito de la casa"
          onChange={(event) => setText('badge', event.target.value)}
          onBlur={() => touch('badge')}
        />
      </FormField>

      {FLAG_QUESTIONS.map(({ flag, question }) => (
        <FormField key={flag} label={question}>
          <PillChoice
            ariaLabel={question}
            options={YES_NO_OPTIONS}
            value={input[flag] ? 'yes' : 'no'}
            onChange={(value) => update(flag, value === 'yes')}
          />
        </FormField>
      ))}
    </>
  );
}
