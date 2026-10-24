/**
 * "Desktop" = wide screen OR a mouse/trackpad (a narrow desktop window is still desktop).
 * Must match the CSS media queries in BottomSheet / ProductRow / CategoryRow.
 */
export const DESKTOP_MEDIA_QUERY = '(min-width: 768px), (hover: hover) and (pointer: fine)';

export function isDesktop(): boolean {
  return window.matchMedia(DESKTOP_MEDIA_QUERY).matches;
}
