/** Pure email helpers shared by the login form and the server action (no red errors — only suggestions). */

const EMAIL_FORMAT = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[^\s@.]{2,}$/;
const COMMON_DOMAINS = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com'];
const DOMAIN_ENDINGS = ['com', 'com.ve', 'net'];
/** The "@" shortcut appears once the name part has at least this many characters. */
const AT_SUGGESTION_MIN_CHARS = 5;

export type EmailSuggestion = { label: string; value: string };

export function isEmailFormatValid(email: string): boolean {
  return EMAIL_FORMAT.test(email.trim());
}

/** Valid format AND not half of a common domain ("ana@gmail.co" is still being typed). */
export function shouldAutoCheckEmail(email: string): boolean {
  if (!isEmailFormatValid(email)) return false;
  const typedDomain = email.slice(email.indexOf('@') + 1);
  return !COMMON_DOMAINS.some((domain) => domain !== typedDomain && domain.startsWith(typedDomain));
}

const EMAIL_IN_TEXT = /[^\s@<>()[\]"',;:]+@[^\s@<>()[\]"',;:]+\.[a-z]{2,}(\.[a-z]{2,})?/i;
const PASSWORD_LABEL = /^\s*(contraseña|contrasena|clave|password|pass|pwd|admin_password)\s*[:=]\s*(.+?)\s*$/i;

/** Smart paste: pulls the email out of any pasted text ("Correo: Ana@Gmail.com ✓" → "ana@gmail.com"). */
export function extractEmailFromPaste(text: string): string {
  const match = text.match(EMAIL_IN_TEXT);
  return sanitizeEmailInput(match ? match[0] : text);
}

/**
 * Smart paste for passwords: trims spaces/new lines and drops a label like "Contraseña:" or
 * "PASSWORD=". With several lines it prefers a labeled one, else the first non-empty line.
 */
export function extractPasswordFromPaste(text: string): string {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  for (const line of lines) {
    const labeled = line.match(PASSWORD_LABEL);
    if (labeled) return labeled[2];
  }
  return lines[0] ?? '';
}

/** Emails never contain spaces, capitals don't matter and only one "@" is allowed — fix silently. */
export function sanitizeEmailInput(raw: string): string {
  const compact = raw.replace(/\s+/g, '').toLowerCase();
  const atIndex = compact.indexOf('@');
  if (atIndex === -1) return compact;
  return compact.slice(0, atIndex + 1) + compact.slice(atIndex + 1).replace(/@/g, '');
}

/**
 * Action pills under the input: "@" after 5 characters → common domains after "@" (filtered
 * by what was typed) → endings (.com, .com.ve, .net) for any other domain.
 */
export function getEmailSuggestions(value: string): EmailSuggestion[] {
  const atIndex = value.indexOf('@');
  if (atIndex === -1) {
    return value.length >= AT_SUGGESTION_MIN_CHARS ? [{ label: '@', value: `${value}@` }] : [];
  }
  const user = value.slice(0, atIndex);
  const typedDomain = value.slice(atIndex + 1);
  if (user === '' || COMMON_DOMAINS.includes(typedDomain)) return [];
  const domains = COMMON_DOMAINS.filter((domain) => domain.startsWith(typedDomain));
  if (domains.length > 0) return domains.map((domain) => ({ label: `@${domain}`, value: `${user}@${domain}` }));
  return getEndingSuggestions(value, typedDomain);
}

function getEndingSuggestions(value: string, typedDomain: string): EmailSuggestion[] {
  const lastDot = typedDomain.lastIndexOf('.');
  if (lastDot === 0) return [];
  const partial = lastDot === -1 ? '' : typedDomain.slice(lastDot + 1);
  const base = lastDot === -1 ? `${value}.` : value.slice(0, value.length - partial.length);
  return DOMAIN_ENDINGS.filter((ending) => ending.startsWith(partial) && ending !== partial).map((ending) => ({
    label: `.${ending}`,
    value: `${base}${ending}`,
  }));
}

/**
 * TEMPORARY (2026-10-23): local calls take milliseconds, so the loading sweep is invisible.
 * Every login API call lasts at least this long so the user can review the animation.
 * Set to 0 (or remove) before production.
 */
export const MIN_LOADING_MS = 1000;

export async function withMinDuration<T>(promise: Promise<T>): Promise<T> {
  const [result] = await Promise.all([promise, new Promise((resolve) => setTimeout(resolve, MIN_LOADING_MS))]);
  return result;
}

/** 600 → "10:00", 59 → "0:59". */
export function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
