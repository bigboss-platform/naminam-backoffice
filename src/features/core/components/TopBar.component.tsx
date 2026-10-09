'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isTabActive, NAV_TABS } from '../config/nav.constants';
import { BrandLogo } from './BrandLogo.component';
import styles from './TopBar.module.css';

/** Mobile: logo + "Administración" badge. Desktop: logo + horizontal navigation. */
export function TopBar() {
  const pathname = usePathname();
  return (
    <header className={styles.topBar}>
      <div className={styles.inner}>
        <Link href="/productos" className={styles.brand} aria-label="Ñami Ñam — administración">
          <BrandLogo height={40} priority />
          <span className={styles.badge}>Administración</span>
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
        </nav>
      </div>
    </header>
  );
}
