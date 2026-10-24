/**
 * Formatting helpers shared by client + server. Pure functions — no React, no DB.
 * Money inputs follow the workspace MoneyInput rule: the user types digits only and the
 * last two digits are cents ("650" → 6,50); display uses comma decimals.
 */

/** "650" (cents typed on the keypad) → 6.5 */
export function centsDigitsToAmount(digits: string): number {
  const cents = Number(digits || '0');
  return Math.round(cents) / 100;
}

/** 6.5 → "650" (keypad digits) */
export function amountToCentsDigits(amount: number): string {
  const cents = Math.round(amount * 100);
  return cents > 0 ? String(cents) : '';
}

/** 1234.5 → "1.234,50" (workspace money format: dot thousands, comma decimals). */
export function formatMoneyInput(amount: number): string {
  const [whole, decimals] = amount.toFixed(2).split('.');
  return `${whole.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${decimals}`;
}

/** Public-menu price style (same as the site): S/ 25, S/ 6.50 */
export function formatMenuPrice(amount: number): string {
  return `S/ ${Number.isInteger(amount) ? amount.toString() : amount.toFixed(2)}`;
}

/** "1000" (keypad) → "10:00"; partial input shows what's typed so far. */
export function timeDigitsToText(digits: string): string {
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
}

/** "10:00" → "1000" */
export function timeTextToDigits(time: string): string {
  return time.replace(':', '');
}

/** "HH:MM" with a real hour (00–23) and minute (00–59). */
export function isValidTime(time: string): boolean {
  const match = /^(\d{2}):(\d{2})$/.exec(time);
  if (!match) return false;
  return Number(match[1]) <= 23 && Number(match[2]) <= 59;
}

/** "19:30" → "7:30 p. m." */
export function formatHour(time: string): string {
  if (!isValidTime(time)) return time;
  const [hourText, minuteText] = time.split(':');
  const hour = Number(hourText);
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minuteText} ${hour < 12 ? 'a. m.' : 'p. m.'}`;
}

/** "51987654321" → "+51 987 654 321" (Peru mobile grouping; other lengths fall back to spaced groups). */
export function formatPhone(digits: string): string {
  if (!digits) return '';
  const match = /^(\d{2})(\d{3})(\d{3})(\d{3})$/.exec(digits);
  if (match) return `+${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
  return `+${digits.replace(/(\d{3})(?=\d)/g, '$1 ')}`;
}

/** "Cheesecake de Fresa" → "cheesecake-de-fresa" */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
