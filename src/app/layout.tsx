import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/components/common/Providers';

export const metadata: Metadata = {
  title: 'متجر حكيم | Hakim Store - Luxury Royal Fragrances & Lifestyle',
  description:
    'Premier destination for royal oriental perfumes, vintage aged dehn oud, and luxury lifestyle timepieces. Crafted with heritage and distinction.',
  keywords: ['oud', 'perfume', 'luxury perfumes', 'dehn oud', 'watches', 'عطور ملكية', 'دهن عود معتق', 'متجر حكيم'],
  authors: [{ name: 'Hakim Store' }],
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#120f0d' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground flex flex-col font-cairo selection:bg-amber-500/20 selection:text-amber-700 dark:selection:text-amber-300">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
