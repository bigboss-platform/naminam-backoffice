import type { Metadata } from 'next';
import { AccountContainer } from '@/features/account/containers/AccountContainer.container';
import { requirePageSession } from '@/server/auth/dal';

export const metadata: Metadata = { title: 'Cuenta' };

export default async function AccountPage() {
  const session = await requirePageSession();
  return <AccountContainer name={session.name} email={session.email} />;
}
