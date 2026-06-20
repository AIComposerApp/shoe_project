import type {Metadata, Viewport} from 'next';
import { Outfit, Playfair_Display } from "next/font/google";
import './globals.css';

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: 'Allbirds - Mens Dasher NZ',
  description: 'Shop the Mens Dasher NZ. A premium, comfortable running shoe made with natural wool and bio-foam.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${playfair.variable} font-sans antialiased bg-brand-sand text-brand-charcoal`} suppressHydrationWarning>{children}</body>
    </html>
  );
}
