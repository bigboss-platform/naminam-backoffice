'use client';

import { FormField } from '@/features/core/components/FormField.component';
import forms from '@/features/core/components/forms.module.css';
import { PillChoice } from '@/features/core/components/PillChoice.component';
import type { ProductFormCtx } from '../hooks/useProductForm.hook';
import type { MediaType } from '../types/Product.type';
import { ProductPreview } from './ProductPreview.component';
import styles from './ProductMediaFields.module.css';

const MEDIA_OPTIONS: { value: MediaType; label: string }[] = [
  { value: 'image', label: 'Foto' },
  { value: 'video', label: 'Video' },
];

/**
 * No media server: the admin pastes a public link to the photo/video. Once there's a
 * usable link, "Ver cómo se verá" shows the card exactly as the menu will show it.
 */
export function ProductMediaFields({ ctx }: { ctx: ProductFormCtx }) {
  const { input, setText, update, touch, errorFor, canPreview, isPreviewOpen, togglePreview } = ctx;
  const isVideo = input.mediaType === 'video';

  return (
    <>
      <FormField label="¿El postre se muestra con foto o con video?">
        <PillChoice
          ariaLabel="Tipo de archivo"
          options={MEDIA_OPTIONS}
          value={input.mediaType}
          onChange={(value) => update('mediaType', value)}
        />
      </FormField>

      <FormField label={isVideo ? 'Pega el enlace del video' : 'Pega el enlace de la foto'} htmlFor="product-media" isOptional error={errorFor('mediaUrl')}>
        <input
          id="product-media"
          className={forms.input}
          type="url"
          inputMode="url"
          autoCapitalize="none"
          value={input.mediaUrl}
          placeholder="https://…"
          onChange={(event) => setText('mediaUrl', event.target.value)}
          onBlur={() => touch('mediaUrl')}
        />
      </FormField>

      <div className={`${forms.reveal} ${isVideo ? forms.revealVisible : ''}`}>
        <div className={forms.revealInner}>
          <FormField label="¿Qué imagen se ve antes de que cargue el video?" htmlFor="product-poster" isOptional error={errorFor('posterUrl')}>
            <input
              id="product-poster"
              className={forms.input}
              type="url"
              inputMode="url"
              autoCapitalize="none"
              value={input.posterUrl}
              placeholder="https://…"
              onChange={(event) => setText('posterUrl', event.target.value)}
              onBlur={() => touch('posterUrl')}
            />
          </FormField>
        </div>
      </div>

      {canPreview && (
        <button type="button" className={`${forms.secondaryButton} ${styles.previewButton}`} onClick={togglePreview}>
          <span className="material-symbols-outlined">{isPreviewOpen ? 'visibility_off' : 'visibility'}</span>
          {isPreviewOpen ? 'Ocultar vista previa' : 'Ver cómo se verá'}
        </button>
      )}
      <div className={`${forms.reveal} ${canPreview && isPreviewOpen ? forms.revealVisible : ''}`}>
        <div className={forms.revealInner}>
          <ProductPreview input={input} />
        </div>
      </div>
    </>
  );
}
