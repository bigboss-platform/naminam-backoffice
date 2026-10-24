'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AccountMenu } from '@/features/account/components/AccountMenu.component';
import { ACCOUNT_HREF, isTabActive, NAV_TABS } from '../config/nav.constants';
import { BrandLogo } from './BrandLogo.component';
import styles from './TopBar.module.css';

/**
 * Mobile: logo + "Administración" badge + person icon → Cuenta page.
 * Desktop: logo + horizontal navigation + Cuenta dropdown.
 */
export function TopBar({ name, email }: { name: string; email: string }) {
  const pathname = usePathname();
  const isAccountActive = isTabActive(pathname, ACCOUNT_HREF);
  return (
    <header className={styles.topBar}>
      <div className={styles.inner}>
        <Link href="/productos" className={styles.brand} aria-label="Santanita — administración">
          <BrandLogo height={40} priority />
          <span className={styles.badge}>Administración</span>
        </Link>
        <Link
          href={ACCOUNT_HREF}
          className={`${styles.accountIcon} ${isAccountActive ? styles.accountIconActive : ''}`}
          aria-label="Cuenta"
          aria-current={isAccountActive ? 'page' : undefined}
        >
          <span className={`material-symbols-outlined ${isAccountActive ? 'icon-filled' : ''}`}>person</span>
        </Link>
        <nav className={styles.desktopNav} aria-label="Principal">
          {NAV_TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`${styles.link} ${isTabActive(pathname, tab.href) ? styles.linkActive : ''}`}
            >
              {tab.label}
            </Link>
          ))}
          <AccountMenu name={name} email={email} />
        </nav>
      </div>
    </header>
  );
}
