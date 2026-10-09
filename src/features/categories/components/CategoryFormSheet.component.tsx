'use client';

import { useState } from 'react';
import { BottomSheet } from '@/features/core/components/BottomSheet.component';
import { FormField } from '@/features/core/components/FormField.component';
import forms from '@/features/core/components/forms.module.css';
import type { Category, CategoryInput } from '@/features/products/types/Category.type';
import { CATEGORY_LIMITS, getCategoryProblems } from '@/features/products/utils/product.validation';
import { saveCategory } from '../actions/category.action';

type CategoryFormSheetProps = {
  open: boolean;
  category: Category | null;
  formKey: number;
  onClose: () => void;
};

export function CategoryFormSheet({ open, category, formKey, onClose }: CategoryFormSheetProps) {
  return (
    <BottomSheet open={open} onClose={onClose} title={category ? 'Editar categoría' : 'Nueva categoría'} subtitle={category?.label ?? ''}>
      <CategoryForm key={formKey} category={category} onSaved={onClose} />
    </BottomSheet>
  );
}

function CategoryForm({ category, onSaved }: { category: Category | null; onSaved: () => void }) {
  const [input, setInput] = useState<CategoryInput>({ label: category?.label ?? '', tagline: category?.tagline ?? '' });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const problems = getCategoryProblems(input);
  const isComplete = Object.keys(problems).length === 0;

  const update = (key: keyof CategoryInput, value: string) => {
    setSaveError('');
    setInput((current) => ({ ...current, [key]: value }));
  };

  const save = async () => {
    if (!isComplete || isSaving) return;
    setIsSaving(true);
    const result = await saveCategory(category?.id ?? '', input);
    setIsSaving(false);
    if (!result.ok) return setSaveError(result.error);
    onSaved();
  };

  return (
    <form
      className={forms.form}
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
    >
      <FormField label="¿Cómo se llama la categoría?" htmlFor="category-label" error={input.label ? (problems.label ?? '') : ''}>
        <input id="category-label" className={forms.input} value={input.label} maxLength={CATEGORY_LIMITS.labelMax} placeholder="Ej. Tortas enteras" onChange={(event) => update('label', event.target.value)} />
      </FormField>
      <FormField label="¿Qué frase va debajo del título en el menú?" htmlFor="category-tagline" isOptional error={problems.tagline ?? ''}>
        <input id="category-tagline" className={forms.input} value={input.tagline} maxLength={CATEGORY_LIMITS.taglineMax} placeholder="Ej. Para celebrar en grande." onChange={(event) => update('tagline', event.target.value)} />
      </FormField>
      {saveError && <p className={forms.formError}>{saveError}</p>}
      {isComplete && (
        <button type="submit" className={forms.primaryButton}>
          {isSaving ? 'Guardando…' : category ? 'Guardar cambios' : 'Crear categoría'}
        </button>
      )}
    </form>
  );
}
