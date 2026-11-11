import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'À propos | Expert Diagnostic' };

export default function AboutPage() {
  return (
    <div className="site-width py-10 sm:py-12">
      <div className="max-w-3xl">
        <h1 className="page-title">À propos d’Expert Diagnostic</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-700">
          Nous fournissons des analyseurs, des réactifs et des consommables aux laboratoires de biologie médicale en Algérie.
        </p>
      </div>

      <div className="mt-8 grid gap-6 border-y border-line py-7 md:grid-cols-3">
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Choisir un produit</h2>
          <p className="text-sm leading-relaxed text-slate-700">
            Le catalogue regroupe nos produits par spécialité, dont la biochimie, l’hématologie et l’immunologie.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Demander un devis</h2>
          <p className="text-sm leading-relaxed text-slate-700">
            Indiquez les références, les quantités et la wilaya de livraison. Notre équipe vous répond avec un prix et un délai.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Entretenir un analyseur</h2>
          <p className="text-sm leading-relaxed text-slate-700">
            Pour une intervention ou un étalonnage, transmettez au SAV le modèle, le numéro de série et les symptômes observés.
          </p>
        </section>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/catalogue" className="button-primary">Voir le catalogue</Link>
        <Link href="/contact" className="button-secondary">Nous contacter</Link>
      </div>
    </div>
  );
}
