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

// Vercel exposes the production domain at build time, so absolute OG and canonical
// URLs stay correct whatever the deployment is called. NEXT_PUBLIC_SITE_URL wins when
// a custom domain is attached; localhost keeps `next dev` resolvable.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${studio.name} — ${studio.discipline}`,
    template: `%s — ${studio.name}`,
  },
  description:
    'Architect Portfolio is a Lisbon studio working across architecture and interiors — from the first sketch to the last handle.',
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
