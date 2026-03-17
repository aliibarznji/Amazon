import type { Metadata } from 'next';
import { Manrope, Space_Grotesk } from 'next/font/google';

import { StoreProvider } from '@/components/store-provider';

import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans'
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display'
});

export const metadata: Metadata = {
  title: 'Amazon Store',
  description: 'A modern Amazon-style storefront built with Next.js and TypeScript'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${spaceGrotesk.variable}`}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
