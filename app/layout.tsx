import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';

import { StoreProvider } from '@/components/store-provider';

import './globals.css';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700']
});

export const metadata: Metadata = {
  title: 'Amazon Clone',
  description: 'A Next.js Amazon storefront demo'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
