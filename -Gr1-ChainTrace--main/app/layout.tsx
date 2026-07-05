import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Grain } from '@/components/ui/grain';
import { Aurora } from '@/components/ui/aurora';
import { Toaster } from 'react-hot-toast';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ChainTrace — Supply Chain Escrow & Financing on Stellar',
  description: 'Trustless trade coordination and milestone-based escrow on Stellar Soroban. Cross-border supply chain financing with SEP-31 anchors.',
  keywords: ['Stellar', 'Soroban', 'supply chain', 'escrow', 'trade finance', 'USDC', 'SEP-31'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable} dark`} suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="anonymous" href="https://fonts.gstatic.com" rel="preconnect" />
        <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`min-h-screen bg-canvas font-sans text-ink antialiased`}>
        <Grain />
        <Aurora />
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgb(16, 16, 19)',
              color: 'rgb(246, 246, 248)',
              border: '1px solid rgb(33, 33, 39)',
            },
          }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
