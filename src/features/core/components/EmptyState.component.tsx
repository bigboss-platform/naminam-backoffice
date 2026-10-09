import styles from './EmptyState.module.css';

type EmptyStateProps = {
  icon: string;
  title: string;
  text: string;
  actionLabel?: string;
  onAction?: () => void;
};

/** Never a blank screen: icon + short copy + optional next step. */
export function EmptyState({ icon, title, text, actionLabel = '', onAction }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <span className={`material-symbols-outlined ${styles.icon}`}>{icon}</span>
      <p className={styles.title}>{title}</p>
      <p className={styles.text}>{text}</p>
      {actionLabel && onAction && (
        <button type="button" className={styles.action} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
