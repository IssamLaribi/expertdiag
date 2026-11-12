'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ProductImage } from '@/components/ProductImage';
import { normalizeCatalogueText, productLabels, PRODUCT_TYPE_LABELS } from '@/lib/catalogue';

function CatalogueContent({ initialQuery, initialDomain }: { initialQuery: string; initialDomain: string }) {
  const { products, productsLoading } = useApp();
  const [query, setQuery] = useState(initialQuery);
  const [domain, setDomain] = useState(initialDomain);
  const [brand, setBrand] = useState('');
  const [type, setType] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const visibleProducts = products.filter((product) => product.visible);
  const domains = productLabels(visibleProducts, 'domain');
  const brands = productLabels(visibleProducts, 'brand');
  const domainValue = domains.find((value) => normalizeCatalogueText(value) === normalizeCatalogueText(domain));
  const terms = normalizeCatalogueText(query).split(/\s+/).filter(Boolean);
  const filtered = visibleProducts.filter((product) => {
    if (domain && normalizeCatalogueText(product.domain) !== normalizeCatalogueText(domain)) return false;
    if (brand && normalizeCatalogueText(product.brand) !== normalizeCatalogueText(brand)) return false;
    if (type && product.type !== type) return false;
    if (availableOnly && product.status !== 'available') return false;
    const searchable = normalizeCatalogueText([product.name, product.reference, product.brand, product.domain, product.description].join(' '));
    return terms.every((term) => searchable.includes(term));
  });
  const activeFilters = Number(Boolean(domain)) + Number(Boolean(brand)) + Number(Boolean(type)) + Number(availableOnly);

  function resetFilters() {
    setQuery('');
    setDomain('');
    setBrand('');
    setType('');
    setAvailableOnly(false);
  }

  return (
    <>
      <div className="mt-5 flex max-w-2xl gap-2">
        <div className="relative min-w-0 flex-1">
          <label htmlFor="catalogue-search" className="sr-only">Chercher un produit</label>
          <Search size={17} className="pointer-events-none absolute top-3.5 left-3 text-slate-500" aria-hidden="true" />
          <input id="catalogue-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nom, marque ou référence" className="field-input min-h-11 pl-9" />
        </div>
        <button type="button" onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen} aria-controls="catalogue-filters" className="button-secondary shrink-0 lg:hidden">
          <SlidersHorizontal size={16} aria-hidden="true" />
          Filtres{activeFilters > 0 ? ` (${activeFilters})` : ''}
        </button>
      </div>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-8">
        <aside id="catalogue-filters" aria-label="Filtres du catalogue" className={`${filtersOpen ? 'block' : 'hidden'} rounded-lg border border-line bg-paper p-4 lg:block`}>
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold">Filtres</h2>
            <button type="button" onClick={resetFilters} className="text-xs font-semibold text-brand underline-offset-4 hover:underline">Réinitialiser</button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <label className="grid gap-1.5 text-sm font-medium">
              Spécialité
              <select value={domainValue ?? domain} onChange={(event) => setDomain(event.target.value)} className="field-input">
                <option value="">Toutes les spécialités</option>
                {domain && !domainValue && <option value={domain}>{domain}</option>}
                {domains.map((value) => <option key={value}>{value}</option>)}
              </select>
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              Marque
              <select value={brand} onChange={(event) => setBrand(event.target.value)} className="field-input">
                <option value="">Toutes les marques</option>
                {brands.map((value) => <option key={value}>{value}</option>)}
              </select>
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              Type de produit
              <select value={type} onChange={(event) => setType(event.target.value)} className="field-input">
                <option value="">Tous les types</option>
                {Object.entries(PRODUCT_TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <label className="flex min-h-11 items-center gap-2 text-sm md:min-h-0">
              <input className="size-4 accent-brand" type="checkbox" checked={availableOnly} onChange={(event) => setAvailableOnly(event.target.checked)} />
              Disponibles uniquement
            </label>
          </div>
        </aside>

        <section aria-label="Produits" className="min-w-0">
          <p aria-live="polite" className="mb-3 text-sm text-slate-600">
            {productsLoading && filtered.length === 0 ? 'Chargement du catalogue…' : `${filtered.length} produit${filtered.length > 1 ? 's' : ''}`}
          </p>
          {filtered.length > 0 ? (
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <li key={product.id} className="rounded-lg border border-line transition-colors hover:border-brand">
                  <Link href={`/catalogue/${encodeURIComponent(product.id)}`} className="group grid h-full grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-3 rounded-lg p-3 sm:grid-cols-1 sm:items-start">
                    <ProductImage src={product.image} alt="" className="h-25 rounded-md border border-line sm:h-36" />
                    <div>
                      <p className="text-xs text-slate-600">{product.brand} · {product.reference}</p>
                      <h2 className="mt-1 text-sm leading-snug font-semibold group-hover:underline">{product.name}</h2>
                      <p className={`mt-2 text-xs font-medium ${product.status === 'available' ? 'text-emerald-800' : 'text-slate-600'}`}>
                        {product.status === 'available' ? 'Disponible' : 'Indisponible'}
                      </p>
                      <p className="mt-1 text-xs text-slate-600">{product.priceEstimate || 'Sur devis'}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : !productsLoading && (
            <div className="space-y-2 rounded-lg border border-line p-5">
              <h2 className="font-semibold">Aucun produit trouvé</h2>
              <p className="text-sm text-slate-600">Essayez une autre référence ou supprimez un filtre.</p>
              <button type="button" onClick={resetFilters} className="button-secondary mt-2">Effacer la recherche</button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function CatalogueSearch() {
  const params = useSearchParams();
  const query = params.get('q') ?? '';
  const domain = params.get('domain') ?? '';
  return <CatalogueContent key={params.toString()} initialQuery={query} initialDomain={domain === 'all' ? '' : domain} />;
}

export default function CataloguePage() {
  return (
    <div className="site-width py-7 sm:py-10">
      <h1 className="page-title">Catalogue</h1>
      <Suspense fallback={<p className="mt-6 text-sm text-slate-600">Chargement du catalogue…</p>}>
        <CatalogueSearch />
      </Suspense>
    </div>
  );
}
