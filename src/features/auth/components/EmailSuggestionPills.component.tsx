import { getEmailSuggestions } from '../utils/email.util';
import styles from './EmailSuggestionPills.module.css';

/**
 * Action pills that help finish the email instead of red errors: "@" after 5 characters,
 * then common domains, then endings (.com, .com.ve, .net). onPointerDown + preventDefault
 * keeps the input focused while tapping.
 */
export function EmailSuggestionPills({ value, onPick }: { value: string; onPick: (email: string) => void }) {
  const suggestions = getEmailSuggestions(value);
  if (suggestions.length === 0) return null;

  return (
    <div className={styles.pills}>
      {suggestions.map((suggestion) => (
        <button
          key={suggestion.value}
          type="button"
          className={`${styles.pill} ${suggestion.label === '@' ? styles.atPill : ''}`}
          onPointerDown={(event) => {
            event.preventDefault();
            onPick(suggestion.value);
          }}
        >
          {suggestion.label}
        </button>
      ))}
    </div>
  );
}
