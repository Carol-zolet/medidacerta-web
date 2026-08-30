import type { Metadata, Viewport } from 'next';
import { Playfair_Display } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

// Serif elegante para títulos (identidade "couro premium"); o corpo do texto
// continua sans-serif, definido em globals.css.
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MedidaCerta',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={playfairDisplay.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
