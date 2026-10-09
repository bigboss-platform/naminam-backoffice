import type { ReactNode } from 'react';
import styles from './PageHeader.module.css';

type PageHeaderProps = {
  title: string;
  subtitle: string;
  /** ⓘ info sheet trigger (every view has one — workspace rule). */
  info: ReactNode;
};

/** iOS-style large title for each view. */
export function PageHeader({ title, subtitle, info }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.titleRow}>
        <h1 className={`${styles.title} font-display`}>{title}</h1>
        {info}
      </div>
      <p className={styles.subtitle}>{subtitle}</p>
    </header>
  );
}
