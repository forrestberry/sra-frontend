import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import { SupabaseProvider } from '@/lib/supabase/provider';
import { APP_DESCRIPTION, APP_NAME } from '@/lib/utils/app-info';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} text-base`}>
        <SupabaseProvider>
          <div className="flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
            <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
              Built with Next.js + Supabase • {new Date().getFullYear()}
            </footer>
          </div>
        </SupabaseProvider>
      </body>
    </html>
  );
}
