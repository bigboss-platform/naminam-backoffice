'use client';

import { FormField } from '@/features/core/components/FormField.component';
import forms from '@/features/core/components/forms.module.css';
import { SaveButton } from '@/features/core/components/SaveButton.component';
import { getMediaUrlProblem } from '@/features/core/utils/links.util';
import { ProductMedia } from '@/features/products/components/ProductMedia.component';
import { saveBrand } from '../actions/business.action';
import { useSectionForm } from '../hooks/useSectionForm.hook';
import type { BrandInput, BusinessSettings } from '../types/BusinessSettings.type';
import { getBrandProblems } from '../utils/business.validation';
import styles from './BrandForm.module.css';

/** Business name, tagline and the home-page cover photo (link + live preview). */
export function BrandForm({ settings, onSaved }: { settings: BusinessSettings; onSaved: () => void }) {
  const form = useSectionForm<BrandInput>(
    { name: settings.name, tagline: settings.tagline, heroImageUrl: settings.heroImageUrl },
    getBrandProblems,
    saveBrand,
    onSaved,
    ['name'],
  );
  const { input, update, touch, errorFor } = form;
  const heroUrl = input.heroImageUrl.trim();
  const canPreview = heroUrl !== '' && getMediaUrlProblem(heroUrl) === '';

  return (
    <form className={forms.form} onSubmit={(event) => { event.preventDefault(); void form.save(); }}>
      <FormField label="¿Cómo se llama el negocio?" htmlFor="brand-name" error={errorFor('name')}>
        <input id="brand-name" className={forms.input} value={input.name} onChange={(event) => update('name', event.target.value)} onBlur={() => touch('name')} />
      </FormField>
      <FormField label="¿Qué frase lo acompaña?" htmlFor="brand-tagline" isOptional>
        <input id="brand-tagline" className={forms.input} value={input.tagline} placeholder="Ej. Dulcería · Pastelería" onChange={(event) => update('tagline', event.target.value)} />
      </FormField>
      <FormField label="¿Cuál es el enlace de la foto de portada del inicio?" htmlFor="brand-hero" isOptional error={errorFor('heroImageUrl')}>
        <input id="brand-hero" className={forms.input} type="url" inputMode="url" autoCapitalize="none" value={input.heroImageUrl} placeholder="https://…" onChange={(event) => update('heroImageUrl', event.target.value)} onBlur={() => touch('heroImageUrl')} />
      </FormField>
      {canPreview && (
        <div className={styles.heroPreview}>
          <ProductMedia mediaType="image" mediaUrl={heroUrl} posterUrl="" alt="Portada" isLive sizes="480px" />
        </div>
      )}
      <SaveButton isVisible={form.isComplete} isSaving={form.isSaving} error={form.saveError} />
    </form>
  );
}
