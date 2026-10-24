'use client';

import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { BrandLogo } from './BrandLogo.component';
import styles from './AuthTransition.module.css';

/**
 * Full-screen logo splash between login → admin (ported from axion-bo-nuxt's
 * useAuthTransition, 2026-10-23). Slides in from the right, navigates underneath while the
 * screen is covered (the next page loads its data behind the logo), holds, then leaves to the
 * left. Lives in the root layout so it survives the route change, outside `.page-fade-in`.
 */
type Phase = 'idle' | 'entering' | 'visible' | 'leaving';

const SLIDE_DURATION_MS = 450;
const HOLD_DURATION_MS = 1000;
/** Never keep the user stuck behind the logo if the next page is slow. */
const MAX_ARRIVAL_WAIT_MS = 8000;

type AuthTransitionApi = { play: (onCovered: () => void, targetPath: string) => Promise<void> };

const AuthTransitionContext = createContext<AuthTransitionApi>({ play: async (onCovered) => onCovered() });

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
const NO_ARRIVAL = { target: '', resolve: () => {} };

export function AuthTransitionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>('idle');
  const arrival = useRef(NO_ARRIVAL);

  useEffect(() => {
    if (arrival.current.target !== '' && pathname === arrival.current.target) arrival.current.resolve();
  }, [pathname]);

  const play = async (onCovered: () => void, targetPath: string) => {
    setPhase('entering');
    // One frame at the off-screen position first, or the slide has nothing to animate from
    await nextFrame();
    setPhase('visible');
    await wait(SLIDE_DURATION_MS);

    const arrived = new Promise<void>((resolve) => {
      arrival.current = { target: targetPath, resolve };
    });
    onCovered();
    await Promise.all([wait(HOLD_DURATION_MS), Promise.race([arrived, wait(MAX_ARRIVAL_WAIT_MS)])]);
    arrival.current = NO_ARRIVAL;

    setPhase('leaving');
    await wait(SLIDE_DURATION_MS);
    setPhase('idle');
  };

  const phaseClass = phase === 'visible' ? styles.visible : phase === 'leaving' ? styles.leaving : '';

  return (
    <AuthTransitionContext value={{ play }}>
      {children}
      {phase !== 'idle' && (
        <div className={`${styles.overlay} ${phaseClass}`} aria-hidden="true">
          <span className={styles.logo}>
            <BrandLogo height={96} priority />
          </span>
        </div>
      )}
    </AuthTransitionContext>
  );
}

export function useAuthTransition(): AuthTransitionApi {
  return useContext(AuthTransitionContext);
}
