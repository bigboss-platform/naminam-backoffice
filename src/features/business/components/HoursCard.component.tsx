import { formatHour } from '@/features/core/utils/format.util';
import type { OpeningHoursRow } from '../types/BusinessSettings.type';
import styles from './HoursCard.module.css';

type HoursCardProps = {
  hours: OpeningHoursRow[];
  onOpenRow: (row: OpeningHoursRow) => void;
  onAddRow: () => void;
};

/** Opening hours: each row is tappable (edit/delete in its own sheet); "+" adds a row. */
export function HoursCard({ hours, onOpenRow, onAddRow }: HoursCardProps) {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <span className={styles.icon}>
          <span className="material-symbols-outlined">schedule</span>
        </span>
        <h2 className={`${styles.title} font-display`}>Horarios</h2>
        <button type="button" className={styles.addButton} onClick={onAddRow} aria-label="Agregar horario">
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>
      {hours.length === 0 ? (
        <p className={styles.empty}>Sin horarios. Toca + para agregar el primero.</p>
      ) : (
        <ul className={styles.list}>
          {hours.map((row) => (
            <li key={row.id}>
              <button type="button" className={styles.row} onClick={() => onOpenRow(row)}>
                <span className={styles.day}>{row.label}</span>
                <span className={styles.time}>
                  {formatHour(row.opensAt)} – {formatHour(row.closesAt)}
                </span>
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
