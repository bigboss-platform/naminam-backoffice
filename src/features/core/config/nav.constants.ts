export type NavTab = { label: string; href: string; icon: string };

/** Max 3 tabs (workspace rule). Mobile: bottom tab bar. Desktop: top bar links. */
export const NAV_TABS: NavTab[] = [
  { label: 'Productos', href: '/productos', icon: 'inventory_2' },
  { label: 'Negocio', href: '/negocio', icon: 'storefront' },
  { label: 'Cuenta', href: '/cuenta', icon: 'person' },
];

export function isTabActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
