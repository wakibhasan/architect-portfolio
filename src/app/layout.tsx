import type { Metadata, Viewport } from 'next';
import { Bodoni_Moda, Inter, Pinyon_Script } from 'next/font/google';
import './globals.css';

import { SmoothScroll } from '@/components/providers/SmoothScroll';
import { ThemeController } from '@/components/providers/ThemeController';
import { Nav } from '@/components/layout/Nav';
import { CustomCursor } from '@/components/layout/CustomCursor';
import { studio } from '@/content/studio';

const display = Bodoni_Moda({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
});

const sans = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const script = Pinyon_Script({
  variable: '--font-script',
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://verra-atelier.vercel.app'),
  title: {
    default: `${studio.name} — ${studio.discipline}`,
    template: `%s — ${studio.name}`,
  },
  description:
    'Verra Atelier is a Lisbon studio working across architecture and interiors — from the first sketch to the last handle.',
  openGraph: {
    title: `${studio.name} — ${studio.discipline}`,
    description: 'A Lisbon studio working across architecture and interiors.',
    type: 'website',
    locale: 'en_GB',
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#131a16',
  colorScheme: 'light',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${display.variable} ${sans.variable} ${script.variable} antialiased`}
    >
      <body>
        <SmoothScroll>
          <ThemeController />
          <Nav />
          <CustomCursor />
          <main>{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
