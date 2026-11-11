import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { AppShell } from '@/components/AppShell';
import './globals.css';

const geist = Geist({ variable: '--font-geist', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Expert Diagnostic | Matériel de laboratoire',
  description: 'Catalogue de réactifs, équipements et consommables de laboratoire. Demandes de devis et service après-vente.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={geist.variable}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
