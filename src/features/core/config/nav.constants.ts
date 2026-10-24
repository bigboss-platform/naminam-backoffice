export type NavTab = { label: string; href: string; icon: string };

/**
 * Max 3 tabs (workspace rule). Mobile: bottom tab bar. Desktop: top bar links.
 * Cuenta is not a tab: person icon in the mobile top bar, dropdown on desktop.
 */
export const NAV_TABS: NavTab[] = [
  { label: 'Productos', href: '/productos', icon: 'inventory_2' },
  { label: 'Negocio', href: '/negocio', icon: 'storefront' },
  { label: 'Categorías', href: '/categorias', icon: 'category' },
];

export const ACCOUNT_HREF = '/cuenta';

export function isTabActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
