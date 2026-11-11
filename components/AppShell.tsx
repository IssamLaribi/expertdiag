'use client';

import { useState, type ReactNode } from 'react';
import { AppProvider } from '@/context/AppContext';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';

export function AppShell({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <AppProvider>
      <div className="flex min-h-dvh flex-col">
        <a className="skip-link" href="#main-content">Aller au contenu</a>
        <Header onOpenCart={() => setCartOpen(true)} />
        <main id="main-content" className="flex-1" tabIndex={-1}>{children}</main>
        <Footer />
        <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      </div>
    </AppProvider>
  );
}
