import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Molecule } from '@/components/Molecule';

export const metadata: Metadata = { title: 'À propos | Expert Diagnostic' };

const STEPS = [
  {
    title: 'Choisir un produit',
    text: 'Le catalogue regroupe nos produits par spécialité, dont la biochimie, l’hématologie et l’immunologie. Chaque fiche donne la référence fabricant.',
    href: '/catalogue',
    link: 'Ouvrir le catalogue',
    art: '/art/step-catalogue.webp',
  },
  {
    title: 'Demander un devis',
    text: 'Indiquez les références, les quantités et la wilaya de livraison. Notre équipe vous répond avec un prix et un délai.',
    href: '/contact?subject=quote',
    link: 'Faire une demande',
    art: '/art/step-quote.webp',
  },
  {
    title: 'Entretenir un analyseur',
    text: 'Pour une intervention ou un étalonnage, transmettez au SAV le modèle, le numéro de série et les symptômes observés.',
    href: '/contact?subject=sav',
    link: 'Contacter le SAV',
    art: '/art/step-service.webp',
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-night text-white">
        <Molecule className="pointer-events-none absolute -top-16 -right-20 -z-10 w-[34rem] text-white/[0.06]" />
        <div className="site-width grid grid-cols-[minmax(0,1fr)] items-center gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <div>
            <h1 className="rise headline text-[2.4rem] leading-[1.05] sm:text-[3.2rem]">À propos d’Expert Diagnostic</h1>
            <p className="rise mt-6 max-w-lg text-xl leading-relaxed text-white/75" style={{ '--delay': '120ms' } as React.CSSProperties}>
              Nous fournissons des analyseurs, des réactifs et des consommables aux laboratoires de biologie médicale en Algérie.
            </p>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl ring-1 ring-white/10">
            <Image src="/art/about-storeroom.webp" alt="Réserve de kits de réactifs et analyseur emballé sur palette" fill priority unoptimized sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="site-width py-16 sm:py-20" aria-labelledby="steps-title">
        <h2 id="steps-title" className="headline text-[1.9rem] sm:text-[2.4rem]">Comment nous travaillons</h2>
        <ol className="mt-8 grid gap-5 md:grid-cols-3">
          {STEPS.map(({ title, text, href, link, art }, index) => (
            <li key={title} className="card group relative flex flex-col overflow-hidden p-6 sm:p-7">
              <div className="-mx-6 -mt-6 mb-6 grid place-items-center bg-paper py-6 sm:-mx-7 sm:-mt-7">
                <Image src={art} alt="" width={200} height={200} unoptimized className="size-40 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-2deg]" />
              </div>
              <p className="text-sm font-semibold text-accent">Étape {index + 1}</p>
              <h3 className="headline relative mt-1 text-xl">{title}</h3>
              <p className="relative mt-3 text-[0.9375rem] leading-relaxed text-mute">{text}</p>
              <Link href={href} className="relative mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-brand hover:underline">
                {link} <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
