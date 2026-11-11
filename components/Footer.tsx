import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-8 border-t border-line bg-paper">
      <div className="site-width grid gap-7 py-8 text-sm sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto] lg:gap-12">
        <div className="space-y-3">
          <Image src="/expert_diagnostic_logo.svg" alt="Expert Diagnostic" width={160} height={50} className="h-auto" />
          <p className="max-w-xs text-slate-600">Équipements, réactifs et consommables pour laboratoires en Algérie.</p>
        </div>
        <nav aria-label="Pied de page" className="grid content-start gap-2">
          <Link href="/catalogue" className="hover:underline">Catalogue</Link>
          <Link href="/a-propos" className="hover:underline">À propos</Link>
          <Link href="/contact" className="hover:underline">Contact et SAV</Link>
        </nav>
        <div className="grid content-start gap-2">
          <a href="mailto:contact@expert-diagnostic.dz" className="hover:underline">contact@expert-diagnostic.dz</a>
          <a href="tel:+21323456789" className="hover:underline">+213 (0) 23 45 67 89</a>
          <Link href="/admin" className="text-slate-600 hover:underline">Administration</Link>
        </div>
      </div>
    </footer>
  );
}
