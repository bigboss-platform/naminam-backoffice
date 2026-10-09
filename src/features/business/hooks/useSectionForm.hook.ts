'use client';

import { useState } from 'react';
import type { ActionResult } from '@/features/core/types/ActionResult.type';

/**
 * Generic small-form state for the Negocio sheets: values, per-field problems (shown once
 * the field was touched), "complete" flag (decides if Guardar renders), save with error.
 */
export function useSectionForm<TInput extends Record<string, string>>(
  initial: TInput,
  getProblems: (input: TInput) => Partial<Record<keyof TInput, string>>,
  saveAction: (input: TInput) => Promise<ActionResult>,
  onSaved: () => void,
  requiredKeys: (keyof TInput)[],
) {
  const [input, setInput] = useState<TInput>(initial);
  const [touched, setTouched] = useState<Set<keyof TInput>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const problems = getProblems(input);
  const isComplete = Object.keys(problems).length === 0 && requiredKeys.every((key) => input[key].trim() !== '');

  const update = (key: keyof TInput, value: string) => {
    setSaveError('');
    setInput((current) => ({ ...current, [key]: value }));
  };

  const touch = (key: keyof TInput) => setTouched((current) => new Set(current).add(key));
  const errorFor = (key: keyof TInput) => (touched.has(key) ? (problems[key] ?? '') : '');

  const save = async () => {
    if (!isComplete || isSaving) return;
    setIsSaving(true);
    const result = await saveAction(input);
    setIsSaving(false);
    if (!result.ok) return setSaveError(result.error);
    onSaved();
  };

  return { input, update, touch, errorFor, isComplete, isSaving, saveError, save };
}
