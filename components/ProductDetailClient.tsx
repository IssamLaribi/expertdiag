'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ShoppingCart,
  ShieldCheck,
  Truck,
  Headset,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const CONTAINER = 'max-w-[1760px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-20';
const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2';

const TYPE_LABELS: Record<string, string> = {
  equipment: 'Équipement / Analyseur',
  reagent: 'Réactif',
  consumable: 'Consommable',
};

const ASSURANCES = [
  { icon: Truck, label: 'Livraison sur 58 wilayas' },
  { icon: Headset, label: 'Support & SAV 24/7' },
  { icon: ShieldCheck, label: 'Conformité & traçabilité' },
];

/* -------------------------------------------------------------------------- */
/*  Small building blocks                                                     */
/* -------------------------------------------------------------------------- */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-8 h-[2px] bg-blue-600" />
      <span className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em]">
        {children}
      </span>
    </div>
  );
}

function StatusBadge({ available }: { available: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-semibold ${available ? 'text-emerald-700' : 'text-rose-700'
        }`}
    >
      <span className={`w-2 h-2 rounded-full ${available ? 'bg-emerald-500' : 'bg-rose-500'}`} />
      {available ? 'Disponible immédiatement' : 'Temporairement indisponible'}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export function ProductDetailClient({ id }: { id: string }) {
  const { products, addToCart } = useApp();

  const product = products.find((p) => p.id === id);

  /* ---------------------------- Not found state --------------------------- */
  if (!product) {
    return (
      <div className={`${CONTAINER} py-28`}>
        <div className="max-w-xl mx-auto text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Produit introuvable
          </h2>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
            Le produit demandé n'existe pas ou a été retiré du catalogue.
          </p>
          <Link
            href="/catalogue"
            className={`inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/25 transition ${FOCUS}`}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au catalogue
          </Link>
        </div>
      </div>
    );
  }

  const available = product.status === 'available';
  const features: string[] = product.features ?? [];
  const typeLabel = TYPE_LABELS[product.type] ?? product.type;

  const related = products
    .filter((p) => p.visible && p.id !== product.id && p.domain === product.domain)
    .slice(0, 4);

  const specs = [
    { label: 'Fabricant', value: product.brand },
    { label: 'Type', value: typeLabel },
    { label: 'Référence', value: product.reference, mono: true },
  ];

  return (
    <div className="bg-white selection:bg-blue-600 selection:text-white">
      <div className={`${CONTAINER} py-10 lg:py-14 space-y-16`}>
        {/* ------------------------------ Breadcrumb ----------------------------- */}
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/catalogue" className="hover:text-blue-600 transition flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Retour au catalogue
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">{product.name}</span>
        </div>

        {/* ------------------------------- Main grid ----------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Image */}
          <div className="lg:col-span-7 lg:sticky lg:top-32">
            <div className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-xl h-[340px] sm:h-[480px] lg:h-[600px]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain p-4"
              />
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-5 space-y-8">
            {/* Title block */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Eyebrow>{product.domain}</Eyebrow>
                <StatusBadge available={available} />
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specs */}
            <dl className="grid grid-cols-1 sm:grid-cols-3 rounded-2xl border border-slate-200 bg-slate-50/70 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
              {specs.map((spec) => (
                <div key={spec.label} className="px-5 py-4 space-y-1">
                  <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {spec.label}
                  </dt>
                  <dd
                    className={`text-sm font-bold text-slate-900 ${spec.mono ? 'font-mono' : ''
                      }`}
                  >
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Unavailability notice */}
            {!available && (
              <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl space-y-1.5 text-sm text-amber-800">
                <div className="font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Indisponibilité temporaire
                </div>
                {product.expectedReturnDate && (
                  <div>
                    <strong>Date de retour estimée :</strong> {product.expectedReturnDate}
                  </div>
                )}
                {product.note && <div className="text-amber-700">{product.note}</div>}
              </div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-[0.2em]">
                  Caractéristiques techniques
                </h2>
                <ul className="space-y-3">
                  {features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-px" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Price & action panel */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Tarif & modalité
                  </span>
                  <span className="text-2xl font-extrabold text-slate-900">
                    {product.priceEstimate || 'Sur devis'}
                  </span>
                </div>

                {available ? (
                  <button
                    onClick={() => addToCart(product)}
                    className={`px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/25 transition flex items-center justify-center gap-2.5 ${FOCUS}`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Ajouter à la demande</span>
                  </button>
                ) : (
                  <Link
                    href="/contact"
                    className={`px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 ${FOCUS}`}
                  >
                    <span>Nous contacter / Me notifier</span>
                  </Link>
                )}
              </div>

              <ul className="pt-5 border-t border-slate-200 flex flex-wrap gap-x-6 gap-y-3">
                {ASSURANCES.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    <Icon className="w-4 h-4 text-blue-600" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ---------------------------- Related products ------------------------- */}
        {related.length > 0 && (
          <section className="pt-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 mb-10">
              <div className="space-y-3">
                <Eyebrow>Dans le même domaine</Eyebrow>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Produits <span className="text-blue-600">similaires</span>
                </h2>
              </div>
              <Link
                href={`/catalogue?domain=${encodeURIComponent(product.domain)}`}
                className={`inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition group shrink-0 rounded-lg ${FOCUS}`}
              >
                Voir tout le domaine
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map((item) => (
                <article
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-2xl hover:border-blue-200 transition-all duration-300 flex flex-col group"
                >
                  <Link href={`/catalogue/${item.id}`} className={`block h-48 overflow-hidden bg-slate-100 ${FOCUS}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </Link>
                  <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                        {item.domain}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base mt-1 line-clamp-1">
                        <Link href={`/catalogue/${item.id}`} className="hover:text-blue-600 transition">
                          {item.name}
                        </Link>
                      </h3>
                    </div>
                    <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900">
                        {item.priceEstimate || 'Sur devis'}
                      </span>
                      <Link
                        href={`/catalogue/${item.id}`}
                        className={`px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white font-semibold text-xs rounded-xl transition ${FOCUS}`}
                      >
                        Détails
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}