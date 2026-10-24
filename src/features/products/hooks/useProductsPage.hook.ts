'use client';

import { useState } from 'react';
import { removeProduct, toggleProductFlag } from '../actions/product.action';
import type { Category } from '../types/Category.type';
import type { Product } from '../types/Product.type';

/** Sheet hand-off delay = sheet close animation (workspace closeAndThen pattern). */
const SHEET_CLOSE_MS = 300;

export type ProductSectionData = { category: Category; products: Product[] };

/**
 * Products page state: which sheet is open (actions → form / delete confirm) and the
 * quick toggles. Data itself comes from the server (revalidated after every action).
 */
export function useProductsPage(products: Product[], categories: Category[]) {
  const [selected, setSelected] = useState<Product | null>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  /** Desktop: the row's dropdown menu (mobile always uses the actions sheet). */
  const [menuProductId, setMenuProductId] = useState('');
  const [formProduct, setFormProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [actionError, setActionError] = useState('');

  const sections: ProductSectionData[] = categories.map((category) => ({
    category,
    products: products.filter((product) => product.categoryId === category.slug),
  }));

  const openForm = (product: Product | null) => {
    setFormProduct(product);
    setFormKey((key) => key + 1);
    setIsFormOpen(true);
  };

  /** Close the actions sheet first, then open the next sheet (avoids stacked-sheet z-index clashes). */
  const closeActionsAndThen = (next: () => void) => {
    const wasSheetOpen = isActionsOpen;
    setIsActionsOpen(false);
    setMenuProductId('');
    if (wasSheetOpen) setTimeout(next, SHEET_CLOSE_MS);
    else next();
  };

  const openActions = (product: Product) => {
    setSelected(product);
    setActionError('');
    setMenuProductId('');
    setIsActionsOpen(true);
  };

  const toggleMenu = (product: Product) => {
    setSelected(product);
    setActionError('');
    setMenuProductId((current) => (current === product.id ? '' : product.id));
  };

  const toggleFlag = async (flag: 'isAvailable' | 'isFeatured') => {
    if (!selected) return;
    setIsWorking(true);
    const result = await toggleProductFlag(selected.id, flag, !selected[flag]);
    setIsWorking(false);
    if (!result.ok) return setActionError(result.error);
    setIsActionsOpen(false);
    setMenuProductId('');
  };

  const confirmDelete = async () => {
    if (!selected) return;
    setIsWorking(true);
    const result = await removeProduct(selected.id);
    setIsWorking(false);
    if (!result.ok) return setActionError(result.error);
    setIsDeleteOpen(false);
  };

  return {
    sections,
    hasCategories: categories.length > 0,
    categories,
    selected,
    isActionsOpen,
    openActions,
    closeActions: () => setIsActionsOpen(false),
    menuProductId,
    toggleMenu,
    closeMenu: () => setMenuProductId(''),
    editSelected: () => closeActionsAndThen(() => openForm(selected)),
    askDeleteSelected: () => closeActionsAndThen(() => setIsDeleteOpen(true)),
    toggleFlag,
    isDeleteOpen,
    closeDelete: () => setIsDeleteOpen(false),
    confirmDelete,
    isWorking,
    actionError,
    formProduct,
    isFormOpen,
    formKey,
    openNewProduct: () => openForm(null),
    closeForm: () => setIsFormOpen(false),
  };
}

export type ProductsPageCtx = ReturnType<typeof useProductsPage>;
