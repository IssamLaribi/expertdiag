import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';
import { Molecule } from '@/components/Molecule';
import { INITIAL_DOMAINS } from '@/data/mockData';

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-night text-sm text-white/70">
      <Molecule className="pointer-events-none absolute -top-36 -right-16 w-[26rem] text-white/[0.06]" />
      <div className="site-width relative grid gap-x-10 gap-y-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.3fr]">
        <div className="space-y-4">
          <Image src="/expert_diagnostic_logo.svg" alt="Expert Diagnostic" width={160} height={50} className="h-auto w-40 brightness-0 invert" />
          <p className="max-w-[18rem] leading-relaxed">Analyseurs, réactifs et consommables pour les laboratoires de biologie médicale en Algérie.</p>
        </div>

        <nav aria-labelledby="footer-catalogue">
          <h2 id="footer-catalogue" className="font-semibold text-white">Spécialités</h2>
          <ul className="mt-4 space-y-2.5">
            {INITIAL_DOMAINS.map(({ id, name }) => (
              <li key={id}>
                <Link href={`/catalogue?domain=${encodeURIComponent(name)}`} className="hover:text-white">{name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-service">
          <h2 id="footer-service" className="font-semibold text-white">Service</h2>
          <ul className="mt-4 space-y-2.5">
            <li><Link href="/catalogue" className="hover:text-white">Catalogue</Link></li>
            <li><Link href="/contact?subject=quote" className="hover:text-white">Demande de devis</Link></li>
            <li><Link href="/contact?subject=sav" className="hover:text-white">Service après-vente</Link></li>
            <li><Link href="/client" className="hover:text-white">Mon espace</Link></li>
            <li><Link href="/a-propos" className="hover:text-white">À propos</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="font-semibold text-white">Nous joindre</h2>
          <ul className="mt-4 space-y-3">
            <li>
              <a href="tel:+21323456789" className="inline-flex items-center gap-2.5 text-lg font-semibold text-white hover:underline">
                <Phone size={17} aria-hidden="true" /> 023 45 67 89
              </a>
            </li>
            <li>
              <a href="mailto:contact@expert-diagnostic.dz" className="inline-flex items-center gap-2.5 break-all hover:text-white hover:underline">
                <Mail size={16} className="shrink-0" aria-hidden="true" /> contact@expert-diagnostic.dz
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="site-width flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-white/50">
          <p>© Expert Diagnostic</p>
          <Link href="/admin" className="hover:text-white">Administration</Link>
        </div>
      </div>
    </footer>
  );
}
