import Image from 'next/image';
import styles from './LoginAnimation.module.css';

export type LoginAnimationName = 'email-not-found' | 'server-error' | 'account-locked';

/**
 * Login moments. Illustrations already delivered (circular PNG/WebP in public/brand) are shown;
 * the rest keep the dashed placeholder until their image or Lottie exists.
 */
const ILLUSTRATIONS: Partial<Record<LoginAnimationName, { src: string; alt: string }>> = {
  'email-not-found': { src: '/brand/confundida.webp', alt: 'Santanita confundida, con un signo de pregunta' },
};

export function LoginAnimation({ name, caption }: { name: LoginAnimationName; caption: string }) {
  const illustration = ILLUSTRATIONS[name];
  return (
    <div className={styles.wrap} aria-live="polite">
      {illustration ? (
        <Image src={illustration.src} alt={illustration.alt} width={160} height={160} className={styles.illustration} />
      ) : (
        <div className={styles.placeholder} aria-hidden="true">
          <span className={styles.placeholderLabel}>Animación</span>
          <code className={styles.placeholderName}>{name}</code>
        </div>
      )}
      <p className={styles.caption}>{caption}</p>
    </div>
  );
}
