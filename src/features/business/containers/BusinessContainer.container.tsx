'use client';

import { InfoSheet } from '@/features/core/components/InfoSheet.component';
import { PageHeader } from '@/features/core/components/PageHeader.component';
import { formatPhone } from '@/features/core/utils/format.util';
import { ProductMedia } from '@/features/products/components/ProductMedia.component';
import { BusinessSheets } from '../components/BusinessSheets.component';
import { HoursCard } from '../components/HoursCard.component';
import { MapPreview } from '../components/MapPreview.component';
import { SettingsCard } from '../components/SettingsCard.component';
import { BUSINESS_INFO } from '../config/businessInfo.constants';
import { useBusinessPage } from '../hooks/useBusinessPage.hook';
import type { BusinessSettings } from '../types/BusinessSettings.type';
import styles from './BusinessContainer.module.css';

export function BusinessContainer({ settings }: { settings: BusinessSettings }) {
  const ctx = useBusinessPage();
  const hasMap = settings.mapLatitude !== 0 || settings.mapLongitude !== 0;

  return (
    <div className="page-fade-in">
      <PageHeader title="Negocio" subtitle="Lo que la web muestra sobre Santanita" info={<InfoSheet {...BUSINESS_INFO} />} />
      <div className={styles.grid}>
        <SettingsCard
          icon="call"
          title="Contacto"
          rows={[
            { label: 'WhatsApp', value: formatPhone(settings.whatsappNumber) },
            { label: 'Llamadas', value: formatPhone(settings.phoneNumber) },
            { label: 'Instagram', value: settings.instagramHandle ? `@${settings.instagramHandle}` : '' },
          ]}
          onEdit={() => ctx.open('contact')}
        />
        <HoursCard hours={settings.hours} onOpenRow={ctx.openHoursRow} onAddRow={() => ctx.openHoursRow(null)} />
        <SettingsCard
          icon="location_on"
          title="Ubicación"
          rows={[
            { label: 'Dirección', value: settings.address },
            { label: 'Ciudad', value: settings.city },
          ]}
          onEdit={() => ctx.open('location')}
        >
          {hasMap && <MapPreview coordinates={{ latitude: settings.mapLatitude, longitude: settings.mapLongitude }} title={settings.address} />}
        </SettingsCard>
        <SettingsCard
          icon="image"
          title="Marca y portada"
          rows={[
            { label: 'Nombre', value: settings.name },
            { label: 'Frase', value: settings.tagline },
          ]}
          onEdit={() => ctx.open('brand')}
        >
          {settings.heroImageUrl && (
            <div className={styles.hero}>
              <ProductMedia mediaType="image" mediaUrl={settings.heroImageUrl} posterUrl="" alt="Portada del inicio" isLive sizes="480px" />
            </div>
          )}
        </SettingsCard>
      </div>
      <BusinessSheets ctx={ctx} settings={settings} />
    </div>
  );
}
