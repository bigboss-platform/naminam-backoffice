import type { Metadata } from 'next';
import { BusinessContainer } from '@/features/business/containers/BusinessContainer.container';
import { requirePageSession } from '@/server/auth/dal';
import { getBusinessSettings } from '@/server/repositories/settings.repository';

export const metadata: Metadata = { title: 'Negocio' };

export default async function BusinessPage() {
  await requirePageSession();
  const settings = await getBusinessSettings();
  return <BusinessContainer settings={settings} />;
}
