import type { ReactNode } from 'react';
import styles from './PageHeader.module.css';

type PageHeaderProps = {
  title: string;
  /** Short line under the header (e.g. the count). It sits closest to the list. */
  subtitle: string;
  /** ⓘ info sheet trigger (every view has one — workspace rule). */
  info: ReactNode;
  /** Main action (e.g. "Nuevo producto"). Mobile: full width under the title. Desktop: right of the title row. */
  action?: ReactNode;
};

/** iOS-style large title for each view. Desktop: ⓘ right next to the title. */
export function PageHeader({ title, subtitle, info, action }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.titleRow}>
        <h1 className={`${styles.title} font-display`}>{title}</h1>
        {info}
        {action && <div className={styles.action}>{action}</div>}
      </div>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  );
}
