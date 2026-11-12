'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, ShoppingCart } from 'lucide-react';
import { ProductImage } from '@/components/ProductImage';
import { useApp } from '@/context/AppContext';
import { normalizeCatalogueText, PRODUCT_TYPE_LABELS } from '@/lib/catalogue';

export function ProductDetailClient({ id }: { id: string }) {
  const { products, productsLoading, cart, addToCart } = useApp();
  const product = products.find((item) => item.id === id && item.visible);

  if (!product) {
    return (
      <div className="site-width py-10">
        {productsLoading ? (
          <p className="text-sm text-slate-600" role="status">Chargement du produit…</p>
        ) : (
          <>
            <h1 className="page-title">Produit introuvable</h1>
            <p className="mt-3 text-slate-700">Consultez le catalogue pour voir les références proposées.</p>
            <Link href="/catalogue" className="button-secondary mt-5">Retour au catalogue</Link>
          </>
        )}
      </div>
    );
  }

  const available = product.status === 'available';
  const quantity = cart.find((item) => item.product.id === id)?.quantity ?? 0;
  const availabilityQuery = new URLSearchParams({
    subject: 'availability',
    product: product.name,
    reference: product.reference,
  });
  const related = products.filter((item) =>
    item.visible && item.id !== id && normalizeCatalogueText(item.domain) === normalizeCatalogueText(product.domain)
  ).slice(0, 3);

  return (
    <div className="site-width py-6 sm:py-9">
      <Link href="/catalogue" className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline">
        <ArrowLeft size={16} aria-hidden="true" /> Catalogue
      </Link>
      <div className="mt-5 grid items-start gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
        <section className="lg:col-start-2 lg:row-start-1">
          <h1 className="page-title">{product.name}</h1>
          <p className="mt-2 text-sm text-slate-700">{product.brand} · Réf. <span className="font-mono">{product.reference}</span></p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <span className={`rounded px-2.5 py-1 font-semibold ${available ? 'bg-emerald-50 text-emerald-800' : 'bg-paper text-slate-700'}`}>
              {available ? 'Disponible' : 'Indisponible'}
            </span>
            <span className="font-semibold">{product.priceEstimate || 'Sur devis'}</span>
          </div>
          {!available && (product.expectedReturnDate || product.note) && (
            <div className="mt-3 space-y-1 text-sm text-slate-600">
              {product.expectedReturnDate && <p>Retour prévu le {product.expectedReturnDate.split('-').reverse().join('/')}</p>}
              {product.note && <p>{product.note}</p>}
            </div>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {available ? (
              <button type="button" onClick={() => addToCart(product)} className="button-primary">
                <ShoppingCart size={17} aria-hidden="true" /> Ajouter à ma demande
              </button>
            ) : (
              <Link href={`/contact?${availabilityQuery}`} className="button-primary">Demander la disponibilité</Link>
            )}
            <p role="status" className="text-sm text-slate-700">
              {quantity > 0 ? `${quantity} dans votre demande` : ''}
            </p>
          </div>
        </section>

        <ProductImage src={product.image} alt={product.name} eager className="h-56 rounded-lg border border-line sm:h-80 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:h-100" />

        <section className="space-y-4 border-t border-line pt-5 lg:col-start-2">
          <h2 className="text-xl font-semibold">Caractéristiques</h2>
          <dl className="divide-y divide-line text-sm">
            <div className="grid grid-cols-[7.5rem_1fr] gap-3 py-2"><dt className="text-slate-600">Spécialité</dt><dd>{product.domain}</dd></div>
            <div className="grid grid-cols-[7.5rem_1fr] gap-3 py-2"><dt className="text-slate-600">Type</dt><dd>{PRODUCT_TYPE_LABELS[product.type]}</dd></div>
          </dl>
          <p className="text-sm leading-relaxed text-slate-700">{product.description}</p>
          {product.features.length > 0 && (
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-700">
              {product.features.map((feature, index) => <li key={`${feature}-${index}`}>{feature}</li>)}
            </ul>
          )}
        </section>
      </div>

      {related.length > 0 && (
        <section className="mt-9 border-t border-line pt-6">
          <h2 className="text-xl font-semibold">Dans la même spécialité</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {related.map((item) => (
              <li key={item.id}>
                <Link href={`/catalogue/${encodeURIComponent(item.id)}`} className="flex h-full items-center justify-between gap-3 rounded-md border border-line p-3 hover:border-brand">
                  <div>
                    <p className="text-xs text-slate-600">{item.reference}</p>
                    <p className="mt-1 text-sm font-semibold">{item.name}</p>
                  </div>
                  <ArrowRight size={16} className="shrink-0 text-brand" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
