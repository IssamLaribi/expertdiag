import type { Metadata } from 'next';
import { Onest } from 'next/font/google';
import { AppShell } from '@/components/AppShell';
import './globals.css';

const onest = Onest({ variable: '--font-onest', subsets: ['latin', 'latin-ext'] });

export const metadata: Metadata = {
  title: 'Expert Diagnostic | Matériel de laboratoire',
  description: 'Catalogue de réactifs, équipements et consommables de laboratoire. Demandes de devis et service après-vente.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={onest.variable}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
