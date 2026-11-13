'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ShoppingCart, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const NAVIGATION = [
  { href: '/catalogue', label: 'Catalogue' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
  { href: '/client', label: 'Mon espace' },
];

export function Header({ onOpenCart }: { onOpenCart: () => void }) {
  const pathname = usePathname();
  const { cart } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const count = cart.reduce((total, item) => total + item.quantity, 0);

  function navigationLinks() {
    return NAVIGATION.map(({ href, label }) => {
      const active = pathname === href || pathname.startsWith(href + '/');
      return (
        <Link
          key={href}
          href={href}
          onClick={() => setMenuOpen(false)}
          aria-current={active ? 'page' : undefined}
          className={active ? 'font-semibold text-brand' : 'text-slate-700 hover:text-brand'}
        >
          {label}
        </Link>
      );
    });
  }

  return (
    <header className="border-b border-line bg-white">
      <div className="site-width flex min-h-17 items-center justify-between gap-2 sm:gap-6">
        <Link href="/" onClick={() => setMenuOpen(false)} className="shrink-0">
          <Image src="/expert_diagnostic_logo.svg" alt="Expert Diagnostic, accueil" width={184} height={58} className="h-auto w-24 min-[370px]:w-31 sm:w-43" />
        </Link>
        <nav aria-label="Navigation principale" className="hidden items-center gap-6 text-sm md:flex">
          {navigationLinks()}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onOpenCart} className="button-primary whitespace-nowrap px-2.5 sm:px-4">
            <ShoppingCart size={16} className="hidden min-[360px]:block" aria-hidden="true" />
            <span>Ma demande</span>
            <span className="rounded bg-white/20 px-1.5 tabular-nums" aria-label={`${count} articles`}>{count}</span>
          </button>
          <button
            type="button"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
            className="button-secondary min-w-11 px-0 md:hidden"
          >
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>
      <nav
        id="mobile-navigation"
        aria-label="Navigation mobile"
        className={menuOpen ? 'border-t border-line md:hidden' : 'hidden'}
      >
        <div className="site-width grid gap-4 py-4 text-sm">{navigationLinks()}</div>
      </nav>
    </header>
  );
}
