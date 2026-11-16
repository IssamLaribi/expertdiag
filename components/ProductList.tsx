'use client';

import Link from 'next/link';
import { Check, Plus } from 'lucide-react';
import { ProductImage } from '@/components/ProductImage';
import { useApp } from '@/context/AppContext';
import type { Product } from '@/types';

/** Prices are free text; anything without a figure is shown as "Sur devis". */
export function Price({ value, className = '' }: { value?: string; className?: string }) {
  return value && /\d/.test(value)
    ? <span className={`font-bold whitespace-nowrap tabular-nums ${className}`}>{value}</span>
    : <span className={`font-medium text-mute ${className}`}>Sur devis</span>;
}

export function Availability({ product }: { product: Product }) {
  const available = product.status === 'available';
  return <span className={`tag ${available ? 'text-ok' : 'text-mute'}`}>{available ? 'En stock' : 'Indisponible'}</span>;
}

export function ProductCard({ product, large = false }: { product: Product; large?: boolean }) {
  const { cart, addToCart } = useApp();
  const inCart = cart.some((item) => item.product.id === product.id);
  const available = product.status === 'available';

  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-line bg-white p-2.5 transition duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-[0_18px_40px_-20px_rgb(14_45_99/0.35)]">
      <div className="relative overflow-hidden rounded-xl">
        <ProductImage
          src={product.image}
          alt=""
          className={`${large ? 'aspect-[5/4]' : 'aspect-square'} transition-transform duration-500 group-hover:scale-[1.04]`}
        />
        <span className="absolute top-2.5 left-2.5"><Availability product={product} /></span>
      </div>
      <div className="flex flex-1 flex-col px-2 pt-3.5 pb-1.5">
        <p className="flex flex-wrap items-center gap-x-2 text-xs text-mute">
          <span className="font-medium text-ink/80">{product.brand}</span>
          <span aria-hidden="true">·</span>
          <span className="ref">{product.reference}</span>
        </p>
        <h3 className={`mt-1.5 leading-snug font-semibold ${large ? 'text-lg' : 'text-[0.9375rem]'}`}>
          <Link href={`/catalogue/${encodeURIComponent(product.id)}`} className="after:absolute after:inset-0 after:rounded-2xl">
            {product.name}
          </Link>
        </h3>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <Price value={product.priceEstimate} className="text-[0.9375rem]" />
          {available && (
            <button
              type="button"
              onClick={() => addToCart(product)}
              aria-label={`Ajouter ${product.name} à ma demande`}
              className={`relative z-10 grid size-10 shrink-0 place-items-center rounded-lg transition ${
                inCart ? 'bg-ok/10 text-ok' : 'bg-paper text-brand hover:bg-brand hover:text-white'
              }`}
            >
              {inCart ? <Check size={18} strokeWidth={2.25} aria-hidden="true" /> : <Plus size={18} strokeWidth={2.25} aria-hidden="true" />}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products, columns = 'sm:grid-cols-2 lg:grid-cols-4' }: { products: Product[]; columns?: string }) {
  return (
    <ul className={`grid gap-4 sm:gap-5 ${columns}`}>
      {products.map((product) => (
        <li key={product.id}><ProductCard product={product} /></li>
      ))}
    </ul>
  );
}
