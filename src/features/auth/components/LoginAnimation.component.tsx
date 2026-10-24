import styles from './LoginAnimation.module.css';

export type LoginAnimationName = 'email-not-found' | 'server-error' | 'account-locked';

/**
 * PLACEHOLDER — the user is making the real animations (Lottie .json, same format as
 * bnpl-app's assets/brands/default/animations). Swap the dashed box for the player and keep
 * the `name` → file mapping; the caption stays.
 */
export function LoginAnimation({ name, caption }: { name: LoginAnimationName; caption: string }) {
  return (
    <div className={styles.wrap} aria-live="polite">
      <div className={styles.placeholder} aria-hidden="true">
        <span className={styles.placeholderLabel}>Animación</span>
        <code className={styles.placeholderName}>{name}</code>
      </div>
      <p className={styles.caption}>{caption}</p>
    </div>
  );
}
