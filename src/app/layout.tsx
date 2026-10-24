import type { Metadata, Viewport } from 'next';
import { Nunito, Shantell_Sans } from 'next/font/google';
import localFont from 'next/font/local';
import { AuthTransitionProvider } from '@/features/core/components/AuthTransition.component';
import './globals.css';

const displayFont = Shantell_Sans({ subsets: ['latin'], weight: ['400', '600', '700', '800'], variable: '--font-display', display: 'swap' });
const sansFont = Nunito({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
/** Self-hosted subsets of Material Symbols (only the icons we use) — see scripts/fetch-icon-font.mjs */
const iconFont = localFont({ src: './fonts/material-symbols.ttf', variable: '--font-icons', display: 'block' });
const iconFilledFont = localFont({
  src: './fonts/material-symbols-filled.ttf',
  variable: '--font-icons-filled',
  display: 'block',
});

export const metadata: Metadata = {
  title: { default: 'Administración · Santanita', template: '%s · Administración Santanita' },
  description: 'Panel de administración de Los Antojitos de Santanita.',
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: 'Santanita Admin', statusBarStyle: 'default' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#fff6e4',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${displayFont.variable} ${sansFont.variable} ${iconFont.variable} ${iconFilledFont.variable}`}
    >
      <body>
        <AuthTransitionProvider>{children}</AuthTransitionProvider>
      </body>
    </html>
  );
}
