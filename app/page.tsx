'use client';

import { useState, type CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Clock, Phone, Search, Truck } from 'lucide-react';
import { Molecule } from '@/components/Molecule';
import { ProductImage } from '@/components/ProductImage';
import { ProductCard, ProductGrid } from '@/components/ProductList';
import { useApp } from '@/context/AppContext';
import { normalizeCatalogueText } from '@/lib/catalogue';

/** Generated art for each specialty; anything else falls back to the photo stored with the domain. */
const SPECIALTY_ART = new Set(['biochimie', 'hematologie', 'immunologie', 'microbiologie', 'urinalyse']);

function Cover({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <Molecule className="absolute -top-6 -right-10 w-64 text-white/15" />;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      sizes="(min-width: 1024px) 20vw, 60vw"
      className="object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
      onError={() => setFailed(true)}
    />
  );
}

const SAV_SHEET = [
  { label: 'Modèle de l’appareil', value: 'Inscrit sur la façade, par exemple BS-240' },
  { label: 'Numéro de série', value: 'Sur la plaque signalétique' },
  { label: 'Ce que vous observez', value: 'Comportement, code d’erreur affiché' },
];

function delay(ms: number) {
  return { '--delay': `${ms}ms` } as CSSProperties;
}

export default function Home() {
  const { products, domains, deliveryOptions } = useApp();
  const visibleProducts = products.filter((product) => product.visible);
  const specialties = domains
    .map((domain) => {
      const slug = normalizeCatalogueText(domain.name);
      return {
        ...domain,
        cover: SPECIALTY_ART.has(slug) ? `/art/spec-${slug}.webp` : domain.image,
        count: visibleProducts.filter((product) => normalizeCatalogueText(product.domain) === slug).length,
      };
    })
    .filter(({ count }) => count > 0);
  const equipment = visibleProducts.filter((product) => product.type === 'equipment').slice(0, 3);
  const supplies = visibleProducts.filter((product) => product.type !== 'equipment').slice(0, 4);
  const featured = equipment.find((product) => product.reference.toUpperCase() === 'MIN-BS240') ?? equipment[0];
  const delivery = deliveryOptions.filter(({ active }) => active);

  return (
    <>
      {/* Hero: text on the left, illustration on the right. */}
      <section className="relative isolate overflow-hidden bg-night text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(48rem_32rem_at_78%_40%,#123d80_0%,transparent_68%),radial-gradient(30rem_20rem_at_0%_100%,#0e2d63_0%,transparent_70%)]" />
        <Molecule className="pointer-events-none absolute -bottom-28 -left-24 -z-10 w-[32rem] text-white/[0.05]" />

        <div className="site-width grid grid-cols-[minmax(0,1fr)] items-center gap-6 pt-12 pb-24 sm:pt-16 lg:min-h-[40rem] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-6 lg:pb-28">
          <div className="max-w-2xl">
            <h1 className="rise headline text-[2.6rem] leading-[1.03] sm:text-[3.4rem] xl:text-[3.85rem]" style={delay(0)}>
              Analyseurs, réactifs et consommables pour la biologie médicale
            </h1>
            <p className="rise mt-6 max-w-xl text-lg leading-relaxed text-white/75" style={delay(160)}>
              Cherchez par nom, marque ou référence fabricant. Ajoutez les produits à votre demande&nbsp;: nous vous répondons avec un prix et un délai de livraison.
            </p>

            <form action="/catalogue" role="search" className="rise mt-9 flex max-w-xl items-center gap-2 rounded-2xl bg-white p-2 shadow-[0_30px_70px_-25px_rgb(0_0_0/0.7)] focus-within:ring-4 focus-within:ring-accent/40" style={delay(240)}>
              <Search size={20} className="ml-3 shrink-0 text-mute" aria-hidden="true" />
              <label htmlFor="home-search" className="sr-only">Rechercher dans le catalogue</label>
              <input
                id="home-search"
                name="q"
                type="search"
                placeholder="BS-240, glucose, Sysmex…"
                className="min-w-0 flex-1 bg-transparent px-1 py-3 text-base text-ink placeholder:text-mute/80 focus:outline-none"
              />
              <button className="button-primary min-h-12 shrink-0 rounded-xl px-6" type="submit">Rechercher</button>
            </form>

            {specialties.length > 0 && (
              <ul className="rise mt-6 flex flex-wrap gap-2" aria-label="Spécialités" style={delay(320)}>
                {specialties.map(({ id, name }) => (
                  <li key={id}>
                    <Link href={`/catalogue?domain=${encodeURIComponent(name)}`} className="inline-flex rounded-full bg-white/[0.08] px-3.5 py-1.5 text-sm text-white/90 ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-white/20 hover:text-white">
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="rise relative mx-auto w-full max-w-lg lg:max-w-none" style={delay(200)}>
            <Image
              src="/art/hero-illustration.webp"
              alt=""
              width={1400}
              height={933}
              priority
              unoptimized
              className="h-auto w-full lg:scale-[1.12]"
            />
          </div>
        </div>
      </section>

      {/* Featured analyser, overlapping the hero edge. */}
      {featured && (
        <div className="site-width relative z-10 -mt-14">
          <Link
            href={`/catalogue/${encodeURIComponent(featured.id)}`}
            className="group ml-auto flex max-w-xl items-center gap-4 rounded-2xl bg-white p-3 pr-5 shadow-[0_30px_60px_-30px_rgb(7_22_52/0.55)] ring-1 ring-line transition hover:-translate-y-0.5 sm:gap-5"
          >
            <ProductImage src={featured.image} alt="" className="size-24 shrink-0 rounded-xl sm:size-28" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-signal">À la une</p>
              <p className="mt-1 leading-snug font-semibold">{featured.name}</p>
              <p className="mt-1 line-clamp-1 text-sm text-mute">{featured.features[0] ?? featured.brand}</p>
            </div>
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-paper text-brand transition group-hover:bg-brand group-hover:text-white">
              <ArrowRight size={18} aria-hidden="true" />
            </span>
          </Link>
        </div>
      )}

      {specialties.length > 0 && (
        <section className="site-width pt-16 sm:pt-20" aria-labelledby="specialties-title">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="specialties-title" className="headline text-[1.9rem] sm:text-[2.4rem]">Parcourir par spécialité</h2>
              <p className="mt-2 text-mute">{visibleProducts.length} références, de la biochimie à l’urinalyse.</p>
            </div>
            <Link href="/catalogue" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
              Tout le catalogue <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <ul className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
            {specialties.map(({ id, name, cover, count }) => (
              <li key={id} className="w-[64%] shrink-0 snap-start sm:w-[38%] lg:w-auto">
                <Link href={`/catalogue?domain=${encodeURIComponent(name)}`} className="group relative block aspect-[2/3] overflow-hidden rounded-2xl bg-night shadow-[0_20px_40px_-24px_rgb(7_22_52/0.6)]">
                  <Cover src={cover} alt="" />
                  <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,rgb(7_22_52/0.95)_0%,rgb(7_22_52/0.4)_38%,transparent_62%)]" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <p className="text-xs font-medium text-white/65">{count} référence{count > 1 ? 's' : ''}</p>
                    <p className="headline mt-1 flex items-center justify-between gap-2 text-[1.35rem]">
                      {name}
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/15 backdrop-blur-sm transition group-hover:bg-white group-hover:text-brand">
                        <ArrowUpRight size={16} aria-hidden="true" />
                      </span>
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {equipment.length > 0 && (
        <section className="site-width pt-20 sm:pt-24" aria-labelledby="equipment-title">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="equipment-title" className="headline text-[1.9rem] sm:text-[2.4rem]">Analyseurs et équipements</h2>
              <p className="mt-2 text-mute">Prix sur devis, avec un service après-vente pour chaque appareil fourni.</p>
            </div>
            <Link href="/catalogue?type=equipment" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
              Tous les équipements <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {equipment.map((product) => <li key={product.id}><ProductCard product={product} large /></li>)}
          </ul>
        </section>
      )}

      {supplies.length > 0 && (
        <section className="site-width pt-20 sm:pt-24" aria-labelledby="supplies-title">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="supplies-title" className="headline text-[1.9rem] sm:text-[2.4rem]">Réactifs et consommables</h2>
              <p className="mt-2 text-mute">Prix indicatifs, confirmés sur le devis.</p>
            </div>
            <Link href="/catalogue" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
              Voir tout <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-8"><ProductGrid products={supplies} /></div>
        </section>
      )}

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
