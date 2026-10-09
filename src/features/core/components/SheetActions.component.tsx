import styles from './SheetActions.module.css';

export type SheetActionItem = {
  id: string;
  icon: string;
  label: string;
  onSelect: () => void;
  isDanger?: boolean;
};

/**
 * Action rows inside a bottom sheet (workspace rule: 52px rows, 22px icon, left-aligned,
 * danger actions in red after a thick separator).
 */
export function SheetActions({ actions }: { actions: SheetActionItem[] }) {
  return (
    <div className={styles.list}>
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          className={`${styles.action} ${action.isDanger ? styles.danger : ''}`}
          onClick={action.onSelect}
        >
          <span className="material-symbols-outlined">{action.icon}</span>
          {action.label}
        </button>
      ))}
    </div>
  );
}
