'use client';

import { BottomSheet } from '@/features/core/components/BottomSheet.component';
import { ConfirmSheet } from '@/features/core/components/ConfirmSheet.component';
import type { BusinessPageCtx } from '../hooks/useBusinessPage.hook';
import type { BusinessSettings } from '../types/BusinessSettings.type';
import { BrandForm } from './BrandForm.component';
import { ContactForm } from './ContactForm.component';
import { HoursRowForm } from './HoursRowForm.component';
import { LocationForm } from './LocationForm.component';

/** All Negocio edit sheets. Forms are keyed by formKey so each opening starts fresh. */
export function BusinessSheets({ ctx, settings }: { ctx: BusinessPageCtx; settings: BusinessSettings }) {
  const { openSheet, close, formKey, hoursRow } = ctx;

  return (
    <>
      <BottomSheet open={openSheet === 'brand'} onClose={close} title="Marca y portada">
        <BrandForm key={formKey} settings={settings} onSaved={close} />
      </BottomSheet>
      <BottomSheet open={openSheet === 'contact'} onClose={close} title="Contacto">
        <ContactForm key={formKey} settings={settings} onSaved={close} />
      </BottomSheet>
      <BottomSheet open={openSheet === 'location'} onClose={close} title="Ubicación">
        <LocationForm key={formKey} settings={settings} onSaved={close} />
      </BottomSheet>
      <BottomSheet open={openSheet === 'hours'} onClose={close} title={hoursRow ? 'Editar horario' : 'Nuevo horario'} subtitle={hoursRow?.label ?? ''}>
        <HoursRowForm key={formKey} row={hoursRow} onSaved={close} onDelete={ctx.askDeleteHoursRow} />
      </BottomSheet>
      <ConfirmSheet
        open={ctx.isDeleteOpen}
        title={`¿Eliminar "${hoursRow?.label ?? ''}"?`}
        message="Este horario dejará de mostrarse en la web."
        confirmLabel="Eliminar horario"
        isWorking={ctx.isWorking}
        error={ctx.deleteError}
        onConfirm={() => void ctx.confirmDeleteHoursRow()}
        onCancel={ctx.closeDelete}
      />
    </>
  );
}
