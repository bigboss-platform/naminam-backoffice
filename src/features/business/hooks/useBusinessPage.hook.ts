'use client';

import { useState } from 'react';
import { removeHoursRow } from '../actions/business.action';
import type { OpeningHoursRow } from '../types/BusinessSettings.type';

export type BusinessSheet = 'none' | 'brand' | 'contact' | 'location' | 'hours';

/** Which edit sheet is open on the Negocio page (one sheet at a time — never stacked). */
export function useBusinessPage() {
  const [openSheet, setOpenSheet] = useState<BusinessSheet>('none');
  const [formKey, setFormKey] = useState(0);
  const [hoursRow, setHoursRow] = useState<OpeningHoursRow | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const open = (sheet: BusinessSheet) => {
    setFormKey((key) => key + 1);
    setOpenSheet(sheet);
  };

  return {
    openSheet,
    formKey,
    open,
    close: () => setOpenSheet('none'),
    hoursRow,
    /** null = add a new row */
    openHoursRow: (row: OpeningHoursRow | null) => {
      setHoursRow(row);
      open('hours');
    },
    isDeleteOpen,
    /** From inside the hours sheet: close it first, then confirm (closeAndThen pattern). */
    askDeleteHoursRow: () => {
      setOpenSheet('none');
      setDeleteError('');
      setTimeout(() => setIsDeleteOpen(true), 300);
    },
    closeDelete: () => setIsDeleteOpen(false),
    confirmDeleteHoursRow: async () => {
      if (!hoursRow) return;
      setIsWorking(true);
      const result = await removeHoursRow(hoursRow.id);
      setIsWorking(false);
      if (!result.ok) return setDeleteError(result.error);
      setIsDeleteOpen(false);
    },
    isWorking,
    deleteError,
  };
}

export type BusinessPageCtx = ReturnType<typeof useBusinessPage>;
