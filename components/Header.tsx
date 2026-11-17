'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Phone, Search, ShoppingBag, Truck, X } from 'lucide-react';
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

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/');
  }

  return (
    <>
      <div className="bg-night text-[0.8125rem] text-white/70">
        <div className="site-width flex min-h-9 items-center justify-between gap-4">
          <p className="hidden items-center gap-2 sm:flex">
            <Truck size={15} strokeWidth={1.75} aria-hidden="true" /> Livraison dans toute l’Algérie
          </p>
          <div className="flex items-center gap-5 sm:ml-auto">
            <a href="tel:+21323456789" className="flex items-center gap-2 font-medium text-white hover:underline">
              <Phone size={14} strokeWidth={1.75} aria-hidden="true" /> 023 45 67 89
            </a>
            <a href="mailto:contact@expert-diagnostic.dz" className="hidden hover:text-white hover:underline md:inline">contact@expert-diagnostic.dz</a>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur-md">
        <div className="site-width flex min-h-18 items-center gap-4 lg:gap-10">
          <Link href="/" onClick={() => setMenuOpen(false)} className="shrink-0">
            <Image src="/expert_diagnostic_logo.svg" alt="Expert Diagnostic, accueil" width={184} height={58} priority className="h-auto w-30 min-[370px]:w-36 sm:w-42" />
          </Link>

          <nav aria-label="Navigation principale" className="hidden items-center gap-1 md:flex">
            {NAVIGATION.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? 'page' : undefined}
                className={`relative rounded-lg px-3.5 py-2 text-[0.9375rem] font-medium transition-colors ${
                  isActive(href)
                    ? 'text-brand after:absolute after:inset-x-3.5 after:-bottom-[1.05rem] after:h-0.5 after:rounded-full after:bg-signal'
                    : 'text-ink/70 hover:bg-paper hover:text-ink'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Link href="/catalogue" aria-label="Rechercher dans le catalogue" className="hidden size-11 place-items-center rounded-lg text-ink/70 hover:bg-paper hover:text-ink sm:grid">
              <Search size={20} strokeWidth={1.9} aria-hidden="true" />
            </Link>
            <button type="button" onClick={onOpenCart} className="button-primary relative pr-3.5 pl-3.5 sm:pr-4.5">
              <ShoppingBag size={18} strokeWidth={1.9} aria-hidden="true" />
              <span className="hidden min-[400px]:inline">Ma demande</span>
              <span
                className={`grid min-w-5.5 place-items-center rounded-full px-1.5 py-0.5 text-xs font-bold tabular-nums ${count > 0 ? 'bg-signal text-white' : 'bg-white/15 text-white/85'}`}
                aria-label={`${count} article${count > 1 ? 's' : ''}`}
              >
                {count}
              </span>
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

        <nav id="mobile-navigation" aria-label="Navigation mobile" className={menuOpen ? 'border-t border-line md:hidden' : 'hidden'}>
          <ul className="site-width grid gap-1 py-3">
            {NAVIGATION.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive(href) ? 'page' : undefined}
                  className={`flex min-h-12 items-center rounded-lg px-3 font-medium ${isActive(href) ? 'bg-paper text-brand' : 'text-ink/75'}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
}
