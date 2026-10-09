import type { ReactNode } from 'react';
import styles from './SettingsCard.module.css';

export type SettingsRow = { label: string; value: string };

type SettingsCardProps = {
  icon: string;
  title: string;
  rows: SettingsRow[];
  onEdit: () => void;
  /** Extra content under the rows (map preview, hero photo…). */
  children?: ReactNode;
};

/** Tappable card (whole card) → edit sheet for that section. */
export function SettingsCard({ icon, title, rows, onEdit, children }: SettingsCardProps) {
  return (
    <section className={styles.card}>
      <button type="button" className={styles.header} onClick={onEdit} aria-label={`Editar ${title}`}>
        <span className={styles.icon}>
          <span className="material-symbols-outlined">{icon}</span>
        </span>
        <h2 className={`${styles.title} font-display`}>{title}</h2>
        <span className={styles.edit}>
          <span className="material-symbols-outlined">edit</span>
          Editar
        </span>
      </button>
      {rows.length > 0 && (
        <dl className={styles.rows}>
          {rows.map((row) => (
            <div key={row.label} className={styles.row}>
              <dt>{row.label}</dt>
              <dd className={row.value ? '' : styles.missing}>{row.value || 'Sin definir'}</dd>
            </div>
          ))}
        </dl>
      )}
      {children}
    </section>
  );
}
