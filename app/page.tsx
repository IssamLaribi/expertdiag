'use client';

import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { ProductImage } from '@/components/ProductImage';
import { useApp } from '@/context/AppContext';
import { INITIAL_DOMAINS } from '@/data/mockData';

export default function Home() {
  const { products } = useApp();
  const visibleProducts = products.filter((product) => product.visible);
  const featured = visibleProducts.find((product) => product.reference.toUpperCase() === 'MIN-BS240') ?? visibleProducts[0];
  const specialties = INITIAL_DOMAINS.map(({ name }) => name);

  return (
    <>
      <section className="border-b border-line bg-paper">
        <div className="site-width grid items-center gap-8 py-10 md:grid-cols-[1.3fr_1fr] lg:gap-16 lg:py-14">
          <div>
            <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Équipements et réactifs pour laboratoires
            </h1>
            <p className="mt-4 max-w-lg leading-relaxed text-slate-700">
              Cherchez un analyseur, un réactif ou un consommable par référence, puis envoyez votre demande de devis.
            </p>
            <form action="/catalogue" className="mt-6 flex max-w-xl gap-2">
              <label htmlFor="home-search" className="sr-only">Rechercher dans le catalogue</label>
              <input id="home-search" name="q" type="search" placeholder="Nom, marque ou référence" className="field-input" />
              <button className="button-primary" type="submit">
                <Search size={16} aria-hidden="true" /> Chercher
              </button>
            </form>
            <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {specialties.map((specialty) => (
                <li key={specialty}>
                  <Link href={`/catalogue?domain=${encodeURIComponent(specialty)}`} className="font-medium text-brand underline decoration-line underline-offset-4 hover:decoration-brand">
                    {specialty}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {featured && (
            <Link href={`/catalogue/${featured.id}`} className="rounded-lg border border-line bg-white hover:border-brand">
              <ProductImage src={featured.image} alt={featured.name} eager className="h-48 rounded-t-lg sm:h-56" />
              <div className="flex items-center justify-between gap-2 border-t border-line px-4 py-3 text-sm font-semibold">
                <span>{featured.name}</span>
                <ArrowRight size={17} className="shrink-0 text-brand" aria-hidden="true" />
              </div>
            </Link>
          )}
        </div>
      </section>

      <section className="site-width py-10" aria-labelledby="featured-title">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="featured-title" className="text-2xl font-semibold tracking-tight">Dans le catalogue</h2>
          <Link href="/catalogue" className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline">
            Voir le catalogue <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visibleProducts.slice(0, 4).map((product) => (
            <li key={product.id} className="overflow-hidden rounded-lg border border-line">
              <Link href={`/catalogue/${product.id}`} className="group block h-full">
                <ProductImage src={product.image} alt="" className="h-36 border-b border-line" />
                <div className="px-4 py-3">
                  <p className="text-xs text-slate-600">{product.brand} · {product.reference}</p>
                  <p className="mt-1 text-sm font-semibold group-hover:underline">{product.name}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="site-width pb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-paper p-5 sm:p-7">
          <div>
            <h2 className="text-lg font-semibold">Besoin d’aide avec un équipement ?</h2>
            <p className="mt-1 text-sm text-slate-700">Indiquez le modèle et le numéro de série à notre service après-vente.</p>
          </div>
          <Link href="/contact?subject=sav" className="button-secondary">Contacter le SAV</Link>
        </div>
      </section>
    </>
  );
}
