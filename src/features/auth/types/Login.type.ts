/** Result of the automatic email check (login step 1). */
export type EmailCheck = { exists: boolean; lockSecondsLeft: number };

/** Result of a password attempt. Unexpected failures come back as ActionResult errors instead. */
export type LoginOutcome =
  | { kind: 'signed-in' }
  | { kind: 'wrong-password'; attemptsLeft: number }
  | { kind: 'locked'; lockSecondsLeft: number };

/** The only message shown when the server or the database fails (never a red error). */
export const SUPPORT_ERROR = 'Hubo un error. Por favor contacta a soporte técnico.';
