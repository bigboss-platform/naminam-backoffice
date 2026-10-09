'use client';

import { FormField } from '@/features/core/components/FormField.component';
import forms from '@/features/core/components/forms.module.css';
import { KeypadField } from '@/features/core/components/KeypadField.component';
import { SaveButton } from '@/features/core/components/SaveButton.component';
import { formatPhone } from '@/features/core/utils/format.util';
import { saveContact } from '../actions/business.action';
import { useSectionForm } from '../hooks/useSectionForm.hook';
import type { BusinessSettings, ContactInput } from '../types/BusinessSettings.type';
import { getContactProblems } from '../utils/business.validation';

/** WhatsApp (where orders arrive), phone for "Llamar", Instagram. */
export function ContactForm({ settings, onSaved }: { settings: BusinessSettings; onSaved: () => void }) {
  const form = useSectionForm<ContactInput>(
    { whatsappNumber: settings.whatsappNumber, phoneNumber: settings.phoneNumber, instagramHandle: settings.instagramHandle },
    getContactProblems,
    saveContact,
    onSaved,
    ['whatsappNumber'],
  );
  const { input, update, touch, errorFor } = form;

  return (
    <form className={forms.form} onSubmit={(event) => { event.preventDefault(); void form.save(); }}>
      <FormField label="¿A qué WhatsApp llegan los pedidos?" htmlFor="contact-whatsapp" error={errorFor('whatsappNumber')}>
        <KeypadField id="contact-whatsapp" digits={input.whatsappNumber} onChange={(digits) => update('whatsappNumber', digits)} maxDigits={15} formatDisplay={formatPhone} keyboardLabel="WhatsApp con código de país (58…)" placeholder="58 412 000 0000" onDone={() => touch('whatsappNumber')} />
      </FormField>
      <FormField label="¿A qué número llaman los clientes?" htmlFor="contact-phone" isOptional error={errorFor('phoneNumber')}>
        <KeypadField id="contact-phone" digits={input.phoneNumber} onChange={(digits) => update('phoneNumber', digits)} maxDigits={15} formatDisplay={formatPhone} keyboardLabel="Teléfono con código de país (58…)" placeholder="58 412 000 0000" onDone={() => touch('phoneNumber')} />
      </FormField>
      <FormField label="¿Cuál es el usuario de Instagram?" htmlFor="contact-instagram" isOptional error={errorFor('instagramHandle')}>
        <input id="contact-instagram" className={forms.input} autoCapitalize="none" value={input.instagramHandle} placeholder="nami_pasteleria" onChange={(event) => update('instagramHandle', event.target.value.replace(/^@/, ''))} onBlur={() => touch('instagramHandle')} />
      </FormField>
      <SaveButton isVisible={form.isComplete} isSaving={form.isSaving} error={form.saveError} />
    </form>
  );
}
