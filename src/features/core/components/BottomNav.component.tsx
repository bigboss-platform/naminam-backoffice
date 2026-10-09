'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isTabActive, NAV_TABS } from '../config/nav.constants';
import styles from './BottomNav.module.css';

/** iOS-style tab bar — mobile/tablet only, hidden on desktop (top nav takes over). */
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className={styles.bottomNav} aria-label="Secciones">
      {NAV_TABS.map((tab) => {
        const isActive = isTabActive(pathname, tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className={`material-symbols-outlined ${isActive ? 'icon-filled' : ''}`}>{tab.icon}</span>
            <span className={styles.label}>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
