'use client';

import { FormField } from '@/features/core/components/FormField.component';
import forms from '@/features/core/components/forms.module.css';
import { KeypadField } from '@/features/core/components/KeypadField.component';
import { SaveButton } from '@/features/core/components/SaveButton.component';
import { timeDigitsToText, timeTextToDigits } from '@/features/core/utils/format.util';
import { saveHoursRow } from '../actions/business.action';
import { useSectionForm } from '../hooks/useSectionForm.hook';
import { EMPTY_HOURS_ROW, type HoursRowInput, type OpeningHoursRow } from '../types/BusinessSettings.type';
import { getHoursRowProblems } from '../utils/business.validation';

type HoursRowFormProps = {
  /** null = new row */
  row: OpeningHoursRow | null;
  onSaved: () => void;
  onDelete: () => void;
};

/** One opening-hours row. Times use the numeric keypad in 24h ("1930" → 19:30). */
export function HoursRowForm({ row, onSaved, onDelete }: HoursRowFormProps) {
  const initial: HoursRowInput = row ? { label: row.label, opensAt: row.opensAt, closesAt: row.closesAt } : EMPTY_HOURS_ROW;
  const form = useSectionForm<HoursRowInput>(initial, getHoursRowProblems, (input) => saveHoursRow(row?.id ?? '', input), onSaved, ['label', 'opensAt', 'closesAt']);
  const { input, update, touch, errorFor } = form;

  const timeField = (key: 'opensAt' | 'closesAt', id: string, keyboardLabel: string) => (
    <KeypadField
      id={id}
      digits={timeTextToDigits(input[key])}
      onChange={(digits) => update(key, timeDigitsToText(digits))}
      maxDigits={4}
      formatDisplay={timeDigitsToText}
      keyboardLabel={keyboardLabel}
      placeholder="HH:MM"
      onDone={() => touch(key)}
    />
  );

  return (
    <form className={forms.form} onSubmit={(event) => { event.preventDefault(); void form.save(); }}>
      <FormField label="¿Qué días?" htmlFor="hours-label" error={errorFor('label')}>
        <input id="hours-label" className={forms.input} value={input.label} placeholder="Ej. Martes a viernes" onChange={(event) => update('label', event.target.value)} onBlur={() => touch('label')} />
      </FormField>
      <FormField label="¿A qué hora abren? (formato 24 h)" htmlFor="hours-opens" error={errorFor('opensAt')}>
        {timeField('opensAt', 'hours-opens', 'Abre a las (ej. 1000 = 10:00)')}
      </FormField>
      <FormField label="¿A qué hora cierran? (formato 24 h)" htmlFor="hours-closes" error={errorFor('closesAt')}>
        {timeField('closesAt', 'hours-closes', 'Cierra a las (ej. 2000 = 20:00)')}
      </FormField>
      <SaveButton isVisible={form.isComplete} isSaving={form.isSaving} error={form.saveError} label={row ? 'Guardar cambios' : 'Agregar horario'} />
      {row && (
        <button type="button" className={forms.secondaryButton} onClick={onDelete}>
          Eliminar este horario
        </button>
      )}
    </form>
  );
}
