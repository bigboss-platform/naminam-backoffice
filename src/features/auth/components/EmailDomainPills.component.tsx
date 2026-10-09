import styles from './EmailDomainPills.module.css';

const DOMAINS = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com'];

/**
 * Domain shortcuts (workspace auth rule): appear only after "@", filtered by what follows
 * it, hidden once the domain is complete. onPointerDown + preventDefault keeps the input
 * focused while tapping.
 */
export function EmailDomainPills({ value, onPick }: { value: string; onPick: (email: string) => void }) {
  const atIndex = value.indexOf('@');
  if (atIndex === -1) return null;
  const user = value.slice(0, atIndex);
  const typedDomain = value.slice(atIndex + 1).toLowerCase();
  const suggestions = DOMAINS.filter((domain) => domain.startsWith(typedDomain) && domain !== typedDomain);
  if (user === '' || suggestions.length === 0) return null;

  return (
    <div className={styles.pills}>
      {suggestions.map((domain) => (
        <button
          key={domain}
          type="button"
          className={styles.pill}
          onPointerDown={(event) => {
            event.preventDefault();
            onPick(`${user}@${domain}`);
          }}
        >
          @{domain}
        </button>
      ))}
    </div>
  );
}
