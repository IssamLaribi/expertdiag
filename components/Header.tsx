'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ShoppingCart, MapPin, Shield, User, Menu, X, ChevronDown, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

interface HeaderProps {
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart }) => {
  const { role, setRole, cart } = useApp();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-2xs">
      {/* Main Enterprise Navigation Bar */}
      <div className="max-w-[1760px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-20 h-24 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/expert_diagnostic_logo.svg"
            alt="Expert Diagnostic"
            width={220}
            height={60}
            priority
            className="h-14 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav Links with Red Active Indicator */}
        <nav className="hidden lg:flex items-center gap-10 font-medium text-sm text-slate-700">
          <div className="relative py-2">
            <Link href="/" className={`hover:text-blue-600 transition ${pathname === '/' ? 'text-slate-900 font-semibold' : ''}`}>
              Accueil
            </Link>
            {pathname === '/' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full"></div>
            )}
          </div>

          <div className="relative py-2">
            <Link href="/catalogue" className={`hover:text-blue-600 transition flex items-center gap-1 ${pathname.startsWith('/catalogue') ? 'text-slate-900 font-semibold' : ''}`}>
              <span>Notre catalogue</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            {pathname.startsWith('/catalogue') && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full"></div>
            )}
          </div>

          <div className="relative py-2">
            <Link href="/a-propos" className={`hover:text-blue-600 transition ${pathname === '/a-propos' ? 'text-slate-900 font-semibold' : ''}`}>
              À propos
            </Link>
            {pathname === '/a-propos' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full"></div>
            )}
          </div>

          <div className="relative py-2">
            <Link href="/contact" className={`hover:text-blue-600 transition ${pathname === '/contact' ? 'text-slate-900 font-semibold' : ''}`}>
              Contact
            </Link>
            {pathname === '/contact' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full"></div>
            )}
          </div>
        </nav>

        {/* Right Actions matching example.jpeg */}
        <div className="flex items-center gap-5">

          {/* Cart Counter Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 py-2 px-3 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-semibold transition bg-white"
          >
            <ShoppingCart className="w-4 h-4 text-slate-600" />
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 text-xs flex items-center justify-center font-bold">
              {totalCartItems}
            </span>
          </button>

          {/* Primary CTA Button matching example.jpeg */}
          <button
            onClick={onOpenCart}
            className="hidden sm:flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-600/20 transition"
          >
            <span>Demander un devis</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          {/* Role selector dropdown helper 
          <div className="hidden xl:flex items-center gap-2 text-xs text-slate-500 pl-2 border-l border-slate-200">
            <span>Rôle :</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="bg-slate-100 font-semibold text-slate-800 py-1.5 px-2.5 rounded-lg border border-slate-200 outline-none"
            >
              <option value="visitor">Visiteur</option>
              <option value="customer">Client Labo</option>
              <option value="admin">Admin</option>
            </select>
          </div>*/}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4 font-semibold text-slate-800">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2">Accueil</Link>
          <Link href="/catalogue" onClick={() => setMobileMenuOpen(false)} className="block py-2">Notre catalogue</Link>
          <Link href="/a-propos" onClick={() => setMobileMenuOpen(false)} className="block py-2">À propos</Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-2">Contact</Link>
          <button
            onClick={() => { setMobileMenuOpen(false); onOpenCart(); }}
            className="w-full py-3 bg-blue-600 text-white rounded-xl text-center shadow-md font-semibold mt-2"
          >
            Demander un devis ↗
          </button>
        </div>
      )}
    </header>
  );
};