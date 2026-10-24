import { BottomNav } from '@/features/core/components/BottomNav.component';
import { TopBar } from '@/features/core/components/TopBar.component';
import { requirePageSession } from '@/server/auth/dal';
import styles from './layout.module.css';

/** Logged-in shell. Each page also checks the session next to its data (DAL). */
export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await requirePageSession();
  return (
    <>
      <TopBar name={session.name} email={session.email} />
      <main className={styles.main}>{children}</main>
      <BottomNav />
    </>
  );
}
