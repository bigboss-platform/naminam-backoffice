import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Vollkorn } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

const displayFont = Vollkorn({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const sansFont = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
/** Self-hosted subsets of Material Symbols (only the icons we use) — see scripts/fetch-icon-font.mjs */
const iconFont = localFont({ src: './fonts/material-symbols.ttf', variable: '--font-icons', display: 'block' });
const iconFilledFont = localFont({
  src: './fonts/material-symbols-filled.ttf',
  variable: '--font-icons-filled',
  display: 'block',
});

export const metadata: Metadata = {
  title: { default: 'Administración · Ñami Ñam', template: '%s · Administración Ñami Ñam' },
  description: 'Panel de administración de Ñami Ñam.',
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: 'Ñami Admin', statusBarStyle: 'default' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#fdf6f0',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${displayFont.variable} ${sansFont.variable} ${iconFont.variable} ${iconFilledFont.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
