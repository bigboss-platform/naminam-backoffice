'use client';

import { FormField } from '@/features/core/components/FormField.component';
import forms from '@/features/core/components/forms.module.css';
import { SaveButton } from '@/features/core/components/SaveButton.component';
import { parseMapsCoordinates } from '@/features/core/utils/links.util';
import { saveLocation } from '../actions/business.action';
import { useSectionForm } from '../hooks/useSectionForm.hook';
import type { BusinessSettings, LocationInput } from '../types/BusinessSettings.type';
import { getLocationProblems } from '../utils/business.validation';
import { MapPreview } from './MapPreview.component';

/** Address + Google Maps link. The pin is read from the link and previewed right away. */
export function LocationForm({ settings, onSaved }: { settings: BusinessSettings; onSaved: () => void }) {
  const form = useSectionForm<LocationInput>(
    { address: settings.address, city: settings.city, mapsUrl: settings.mapsUrl },
    getLocationProblems,
    saveLocation,
    onSaved,
    ['address', 'city'],
  );
  const { input, update, touch, errorFor } = form;
  const coordinates = parseMapsCoordinates(input.mapsUrl);

  return (
    <form className={forms.form} onSubmit={(event) => { event.preventDefault(); void form.save(); }}>
      <FormField label="¿Cuál es la dirección?" htmlFor="location-address" error={errorFor('address')}>
        <input id="location-address" className={forms.input} value={input.address} placeholder="Ej. Nueva Segovia, Carrera 3 entre calles 6 y 7" onChange={(event) => update('address', event.target.value)} onBlur={() => touch('address')} />
      </FormField>
      <FormField label="¿En qué ciudad?" htmlFor="location-city" error={errorFor('city')}>
        <input id="location-city" className={forms.input} value={input.city} placeholder="Ej. Barquisimeto" onChange={(event) => update('city', event.target.value)} onBlur={() => touch('city')} />
      </FormField>
      <FormField label="Pega el enlace de Google Maps del local" htmlFor="location-maps" isOptional error={errorFor('mapsUrl')}>
        <input id="location-maps" className={forms.input} type="url" inputMode="url" autoCapitalize="none" value={input.mapsUrl} placeholder="https://www.google.com/maps/place/…" onChange={(event) => update('mapsUrl', event.target.value)} onBlur={() => touch('mapsUrl')} />
      </FormField>
      {coordinates && <MapPreview coordinates={coordinates} title={input.address} />}
      <SaveButton isVisible={form.isComplete} isSaving={form.isSaving} error={form.saveError} />
    </form>
  );
}
