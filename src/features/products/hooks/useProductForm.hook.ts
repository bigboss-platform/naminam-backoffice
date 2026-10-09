'use client';

import { useState } from 'react';
import { amountToCentsDigits, centsDigitsToAmount } from '@/features/core/utils/format.util';
import { getMediaUrlProblem, guessMediaType } from '@/features/core/utils/links.util';
import { saveProduct } from '../actions/product.action';
import { EMPTY_PRODUCT_INPUT, type Product, type ProductInput } from '../types/Product.type';
import { getProductProblems } from '../utils/product.validation';

type TextFieldName = 'name' | 'description' | 'note' | 'badge' | 'mediaUrl' | 'posterUrl';

function toInput(product: Product | null): ProductInput {
  if (!product) return EMPTY_PRODUCT_INPUT;
  const { id, slug, sortOrder, updatedAt, ...input } = product;
  void id;
  void slug;
  void sortOrder;
  void updatedAt;
  return input;
}

/**
 * Create/edit form state. "Guardar" only renders when everything required is valid
 * (workspace rule: never a disabled submit). Errors show per field once touched.
 */
export function useProductForm(product: Product | null, categoryIds: string[], onSaved: () => void) {
  const initial = toInput(product);
  const [input, setInput] = useState<ProductInput>(initial);
  const [priceDigits, setPriceDigits] = useState(amountToCentsDigits(initial.price));
  const [touched, setTouched] = useState<Set<keyof ProductInput>>(new Set());
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const fullInput: ProductInput = { ...input, price: centsDigitsToAmount(priceDigits) };
  const problems = getProductProblems(fullInput, categoryIds);
  const isComplete = Object.keys(problems).length === 0;
  const canPreview = input.mediaUrl.trim() !== '' && getMediaUrlProblem(input.mediaUrl.trim()) === '';

  const update = <TKey extends keyof ProductInput>(key: TKey, value: ProductInput[TKey]) => {
    setSaveError('');
    setInput((current) => ({ ...current, [key]: value }));
  };

  const setText = (key: TextFieldName, value: string) => {
    update(key, value);
    // Pasting a link pre-selects Foto/Video from the file type (the admin can still change it).
    if (key === 'mediaUrl' && value.trim() !== '') update('mediaType', guessMediaType(value.trim()));
  };

  const touch = (key: keyof ProductInput) => setTouched((current) => new Set(current).add(key));
  const errorFor = (key: keyof ProductInput) => (touched.has(key) ? (problems[key] ?? '') : '');

  const save = async () => {
    if (!isComplete || isSaving) return;
    setIsSaving(true);
    const result = await saveProduct(product?.id ?? '', fullInput);
    setIsSaving(false);
    if (!result.ok) return setSaveError(result.error);
    onSaved();
  };

  return {
    isEditing: product !== null,
    input: fullInput,
    priceDigits,
    setPriceDigits: (digits: string) => {
      setSaveError('');
      setPriceDigits(digits);
    },
    update,
    setText,
    touch,
    errorFor,
    isComplete,
    canPreview,
    isPreviewOpen,
    togglePreview: () => setIsPreviewOpen((open) => !open),
    isSaving,
    saveError,
    save,
  };
}

export type ProductFormCtx = ReturnType<typeof useProductForm>;
