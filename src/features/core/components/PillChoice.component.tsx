import styles from './forms.module.css';

export type PillOption<TValue extends string> = { value: TValue; label: string };

type PillChoiceProps<TValue extends string> = {
  options: PillOption<TValue>[];
  value: TValue;
  onChange: (value: TValue) => void;
  ariaLabel: string;
};

/** Single choice as a row of pills — never a <select> (workspace rule). */
export function PillChoice<TValue extends string>({ options, value, onChange, ariaLabel }: PillChoiceProps<TValue>) {
  return (
    <div className={styles.pills} role="radiogroup" aria-label={ariaLabel}>
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            className={`${styles.pill} ${isActive ? styles.pillActive : ''}`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export const YES_NO_OPTIONS: PillOption<'yes' | 'no'>[] = [
  { value: 'yes', label: 'Sí' },
  { value: 'no', label: 'No' },
];
