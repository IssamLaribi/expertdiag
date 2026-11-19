'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, ChevronRight, FileText, Minus, Plus, Truck, Wrench } from 'lucide-react';
import { ProductImage } from '@/components/ProductImage';
import { Availability, Price, ProductGrid } from '@/components/ProductList';
import { useApp } from '@/context/AppContext';
import { normalizeCatalogueText, PRODUCT_TYPE_LABELS } from '@/lib/catalogue';

export function ProductDetailClient({ id }: { id: string }) {
  const { products, productsLoading, cart, addToCart } = useApp();
  const [amount, setAmount] = useState(1);
  const product = products.find((item) => item.id === id && item.visible);

  if (!product) {
    return (
      <div className="site-width py-16">
        {productsLoading ? (
          <p className="text-sm text-mute" role="status">Chargement du produit…</p>
        ) : (
          <div className="max-w-md">
            <h1 className="page-title">Produit introuvable</h1>
            <p className="mt-3 text-mute">Cette référence n’est plus au catalogue, ou le lien est incomplet.</p>
            <Link href="/catalogue" className="button-primary mt-6">Retour au catalogue</Link>
          </div>
        )}
      </div>
    );
  }

  const available = product.status === 'available';
  const inCart = cart.find((item) => item.product.id === id)?.quantity ?? 0;
  const availabilityQuery = new URLSearchParams({
    subject: 'availability',
    product: product.name,
    reference: product.reference,
  });
  const related = products.filter((item) =>
    item.visible && item.id !== id && normalizeCatalogueText(item.domain) === normalizeCatalogueText(product.domain)
  ).slice(0, 4);
  const sheet = [
    { label: 'Référence', value: product.reference },
    { label: 'Fabricant', value: product.brand },
    { label: 'Spécialité', value: product.domain },
    { label: 'Type', value: PRODUCT_TYPE_LABELS[product.type] },
  ];

  function add() {
    if (product) addToCart(product, amount);
  }

  return (
    <div className="site-width pt-6 pb-4 sm:pt-8">
      <nav aria-label="Fil d’Ariane" className="text-sm text-mute">
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          <li><Link href="/catalogue" className="hover:text-brand">Catalogue</Link></li>
          <li aria-hidden="true"><ChevronRight size={14} /></li>
          <li><Link href={`/catalogue?domain=${encodeURIComponent(product.domain)}`} className="hover:text-brand">{product.domain}</Link></li>
          <li aria-hidden="true"><ChevronRight size={14} /></li>
          <li aria-current="page" className="ref text-ink">{product.reference}</li>
        </ol>
      </nav>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14">
        <ProductImage src={product.image} alt={product.name} eager className="aspect-[4/3] rounded-3xl border border-line" />

        <section className="lg:sticky lg:top-24">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full bg-paper px-3 py-1 font-medium text-ink/80">{PRODUCT_TYPE_LABELS[product.type]}</span>
            <span className="rounded-full bg-paper px-3 py-1 font-medium text-ink/80">{product.domain}</span>
          </div>
          <h1 className="page-title mt-4">{product.name}</h1>
          <p className="mt-3 text-mute">
            <span className="font-semibold text-ink">{product.brand}</span> · Réf. <span className="ref text-ink">{product.reference}</span>
          </p>

          <div className="mt-6 rounded-2xl border border-line p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-mute">Prix indicatif</p>
                <Price value={product.priceEstimate} className="mt-1 block text-2xl" />
              </div>
              <Availability product={product} />
            </div>

            {!available && (product.expectedReturnDate || product.note) && (
              <div className="mt-4 space-y-1 rounded-lg bg-paper px-3.5 py-3 text-sm text-mute">
                {product.expectedReturnDate && <p>Retour prévu le <span className="font-semibold text-ink">{product.expectedReturnDate.split('-').reverse().join('/')}</span></p>}
                {product.note && <p>{product.note}</p>}
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              {available ? (
                <>
                  <div className="flex items-center rounded-lg border border-line-strong">
                    <button type="button" onClick={() => setAmount(Math.max(1, amount - 1))} disabled={amount <= 1} aria-label="Diminuer la quantité" className="grid size-11 place-items-center text-ink/70 hover:text-ink disabled:opacity-35">
                      <Minus size={16} aria-hidden="true" />
                    </button>
                    <span className="w-9 text-center font-semibold tabular-nums" aria-live="polite">{amount}</span>
                    <button type="button" onClick={() => setAmount(Math.min(999, amount + 1))} aria-label="Augmenter la quantité" className="grid size-11 place-items-center text-ink/70 hover:text-ink">
                      <Plus size={16} aria-hidden="true" />
                    </button>
                  </div>
                  <button type="button" onClick={add} className="button-primary min-h-11 flex-1 px-6">
                    Ajouter à ma demande
                  </button>
                </>
              ) : (
                <Link href={`/contact?${availabilityQuery}`} className="button-primary min-h-11 flex-1">Demander la disponibilité</Link>
              )}
            </div>
            <p role="status" className="mt-3 flex min-h-5 items-center gap-1.5 text-sm font-medium text-ok">
              {inCart > 0 && <><Check size={15} strokeWidth={2.5} aria-hidden="true" /> {inCart} dans votre demande</>}
            </p>
          </div>

          <ul className="mt-5 grid gap-3 text-sm text-mute">
            <li className="flex items-start gap-3"><FileText size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" /> Aucun paiement en ligne&nbsp;: le prix et le délai sont confirmés par devis.</li>
            <li className="flex items-start gap-3"><Truck size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" /> Livraison dans toute l’Algérie, directe ou par transporteur partenaire.</li>
            {product.type === 'equipment' && (
              <li className="flex items-start gap-3"><Wrench size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" /> Service après-vente pour les pannes et les étalonnages.</li>
            )}
          </ul>
        </section>
      </div>

      <div className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14">
        <section aria-labelledby="description-title" className="card p-6 sm:p-8">
          <h2 id="description-title" className="headline text-2xl">Description</h2>
          <p className="mt-3 leading-relaxed text-ink/80">{product.description}</p>
          {product.features.length > 0 && (
            <ul className="mt-6 grid gap-3">
              {product.features.map((feature, index) => (
                <li key={`${feature}-${index}`} className="flex items-start gap-3 text-[0.9375rem]">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ok/10 text-ok"><Check size={13} strokeWidth={3} aria-hidden="true" /></span>
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="sheet-title" className="card self-start p-6 sm:p-8">
          <h2 id="sheet-title" className="headline text-2xl">Fiche produit</h2>
          <dl className="mt-4 divide-y divide-line text-sm">
            {sheet.map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-4 py-3">
                <dt className="text-mute">{label}</dt>
                <dd className={`text-right font-medium ${label === 'Référence' ? 'ref text-sm' : ''}`}>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      {related.length > 0 && (
        <section className="mt-16" aria-labelledby="related-title">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="related-title" className="headline text-[1.9rem]">Dans la même spécialité</h2>
            <Link href={`/catalogue?domain=${encodeURIComponent(product.domain)}`} className="text-sm font-semibold text-brand hover:underline">Voir toute la spécialité</Link>
          </div>
          <div className="mt-6"><ProductGrid products={related} /></div>
        </section>
      )}
    </div>
  );
}
