'use client';

import { useState } from 'react';
import type { Category } from '@/features/products/types/Category.type';
import { removeCategory, reorderCategory } from '../actions/category.action';

const SHEET_CLOSE_MS = 300;

/** Categorías page: actions sheet / desktop dropdown (edit / move / delete) + form sheet + delete confirmation. */
export function useCategoriesManager(categories: Category[], productCountBySlug: Record<string, number>) {
  const [selected, setSelected] = useState<Category | null>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [formCategory, setFormCategory] = useState<Category | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState('');

  const openForm = (category: Category | null) => {
    setFormCategory(category);
    setFormKey((key) => key + 1);
    setIsFormOpen(true);
  };

  /** Desktop: the row's dropdown menu (mobile always uses the actions sheet). */
  const [menuCategoryId, setMenuCategoryId] = useState('');

  const closeActionsAndThen = (next: () => void) => {
    const wasSheetOpen = isActionsOpen;
    setIsActionsOpen(false);
    setMenuCategoryId('');
    if (wasSheetOpen) setTimeout(next, SHEET_CLOSE_MS);
    else next();
  };

  const closeAll = () => {
    setIsActionsOpen(false);
    setMenuCategoryId('');
  };

  const run = async (task: () => Promise<{ ok: boolean; error?: string }>, onSuccess: () => void) => {
    setIsWorking(true);
    setError('');
    const result = await task();
    setIsWorking(false);
    if (!result.ok) return setError(result.error ?? '');
    onSuccess();
  };

  const selectedIndex = selected ? categories.findIndex((category) => category.id === selected.id) : -1;

  return {
    categories,
    productCountBySlug,
    selected,
    isActionsOpen,
    openActions: (category: Category) => {
      setSelected(category);
      setError('');
      setMenuCategoryId('');
      setIsActionsOpen(true);
    },
    closeActions: () => setIsActionsOpen(false),
    menuCategoryId,
    toggleMenu: (category: Category) => {
      setSelected(category);
      setError('');
      setMenuCategoryId((current) => (current === category.id ? '' : category.id));
    },
    closeMenu: () => setMenuCategoryId(''),
    canMoveUp: selectedIndex > 0,
    canMoveDown: selectedIndex !== -1 && selectedIndex < categories.length - 1,
    move: (direction: -1 | 1) => {
      if (!selected) return;
      void run(() => reorderCategory(selected.id, direction), closeAll);
    },
    editSelected: () => closeActionsAndThen(() => openForm(selected)),
    askDeleteSelected: () => closeActionsAndThen(() => {
      setError('');
      setIsDeleteOpen(true);
    }),
    isDeleteOpen,
    closeDelete: () => setIsDeleteOpen(false),
    confirmDelete: () => {
      if (!selected) return;
      void run(() => removeCategory(selected.id), () => setIsDeleteOpen(false));
    },
    isWorking,
    error,
    formCategory,
    isFormOpen,
    formKey,
    openNewCategory: () => openForm(null),
    closeForm: () => setIsFormOpen(false),
  };
}

export type CategoriesManagerCtx = ReturnType<typeof useCategoriesManager>;
