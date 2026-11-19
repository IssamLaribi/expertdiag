'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, Search, SlidersHorizontal, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ProductGrid } from '@/components/ProductList';
import { normalizeCatalogueText, productLabels, PRODUCT_TYPE_LABELS } from '@/lib/catalogue';
import type { Product } from '@/types';

type Facet = 'domain' | 'brand' | 'type';
type Filters = Record<Facet, string> & { availableOnly: boolean };

const EMPTY_FILTERS: Filters = { domain: '', brand: '', type: '', availableOnly: false };

function sameText(a: string, b: string) {
  return normalizeCatalogueText(a) === normalizeCatalogueText(b);
}

function CatalogueContent({ initialQuery, initialDomain, initialType }: { initialQuery: string; initialDomain: string; initialType: string }) {
  const { products, productsLoading } = useApp();
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<Filters>({ ...EMPTY_FILTERS, domain: initialDomain, type: initialType });
  const [filtersOpen, setFiltersOpen] = useState(false);

  const visibleProducts = products.filter((product) => product.visible);
  const terms = normalizeCatalogueText(query).split(/\s+/).filter(Boolean);

  function facetValue(product: Product, facet: Facet) {
    return facet === 'type' ? product.type : product[facet];
  }

  /** Matches every active filter except `skip`, so each facet can count what selecting it would give. */
  function matches(product: Product, skip?: Facet) {
    for (const facet of ['domain', 'brand', 'type'] as const) {
      if (facet !== skip && filters[facet] && !sameText(facetValue(product, facet), filters[facet])) return false;
    }
    if (filters.availableOnly && product.status !== 'available') return false;
    const searchable = normalizeCatalogueText([product.name, product.reference, product.brand, product.domain, product.description].join(' '));
    return terms.every((term) => searchable.includes(term));
  }

  const filtered = visibleProducts.filter((product) => matches(product));
  const activeFilters = Number(Boolean(filters.domain)) + Number(Boolean(filters.brand)) + Number(Boolean(filters.type)) + Number(filters.availableOnly);

  function options(facet: Facet) {
    const list = facet === 'type'
      ? Object.entries(PRODUCT_TYPE_LABELS).map(([value, label]) => ({ value, label }))
      : productLabels(visibleProducts, facet).map((value) => ({ value, label: value }));
    if (filters[facet] && !list.some(({ value }) => sameText(value, filters[facet]))) {
      list.push({ value: filters[facet], label: filters[facet] });
    }
    return list;
  }

  const facets: { key: Facet; label: string }[] = [
    { key: 'domain', label: 'Spécialité' },
    { key: 'type', label: 'Type de produit' },
    { key: 'brand', label: 'Marque' },
  ];

  function toggle(facet: Facet, value: string) {
    setFilters((previous) => ({ ...previous, [facet]: sameText(previous[facet], value) ? '' : value }));
  }

  function resetFilters() {
    setQuery('');
    setFilters(EMPTY_FILTERS);
  }

  const chips = [
    ...facets.flatMap(({ key }) => filters[key]
      ? [{ id: key, label: key === 'type' ? PRODUCT_TYPE_LABELS[filters.type as keyof typeof PRODUCT_TYPE_LABELS] ?? filters.type : filters[key], clear: () => setFilters((previous) => ({ ...previous, [key]: '' })) }]
      : []),
    ...(filters.availableOnly ? [{ id: 'stock', label: 'En stock', clear: () => setFilters((previous) => ({ ...previous, availableOnly: false })) }] : []),
  ];

  return (
    <>
      <div className="relative isolate overflow-hidden bg-night text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(40rem_24rem_at_80%_50%,#123d80_0%,transparent_70%)]" />
        <div className="site-width py-10 sm:py-14 lg:py-20">
          <h1 className="page-title">Catalogue</h1>
          <p className="mt-2 text-white/70">
            {productsLoading && visibleProducts.length === 0 ? 'Chargement…' : `${visibleProducts.length} références, prix confirmés sur devis.`}
          </p>
          <div className="mt-7 flex max-w-2xl gap-2">
            <div className="relative min-w-0 flex-1">
              <label htmlFor="catalogue-search" className="sr-only">Chercher un produit</label>
              <Search size={19} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-mute" aria-hidden="true" />
              <input id="catalogue-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nom, marque ou référence" className="field-input min-h-13 rounded-xl border-transparent pl-11 text-base shadow-[0_20px_50px_-20px_rgb(0_0_0/0.6)]" />
            </div>
            <button type="button" onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen} aria-controls="catalogue-filters" className="button-secondary min-h-13 shrink-0 rounded-xl border-transparent lg:hidden">
              <SlidersHorizontal size={17} aria-hidden="true" />
              <span className="hidden min-[400px]:inline">Filtres</span>
              {activeFilters > 0 && <span className="grid size-5 place-items-center rounded-full bg-brand text-[0.6875rem] font-bold text-white">{activeFilters}</span>}
            </button>
          </div>
        </div>
      </div>

      <div className="site-width grid grid-cols-[minmax(0,1fr)] items-start gap-8 py-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:py-10">
        <aside
          id="catalogue-filters"
          aria-label="Filtres du catalogue"
          className={`${filtersOpen ? 'grid' : 'hidden'} card gap-6 p-5 sm:grid-cols-2 lg:sticky lg:top-24 lg:grid lg:grid-cols-1`}
        >
          {facets.map(({ key, label }) => (
            <section key={key} aria-label={label}>
              <h2 className="text-xs font-semibold tracking-wide text-mute">{label}</h2>
              <ul className="mt-2 grid gap-0.5">
                {options(key).map(({ value, label: optionLabel }) => {
                  const active = Boolean(filters[key]) && sameText(filters[key], value);
                  const count = visibleProducts.filter((product) => matches(product, key) && sameText(facetValue(product, key), value)).length;
                  return (
                    <li key={value}>
                      <button
                        type="button"
                        aria-pressed={active}
                        disabled={!active && count === 0}
                        onClick={() => toggle(key, value)}
                        className={`-mx-2 flex min-h-10 w-[calc(100%+1rem)] items-center gap-3 rounded-lg px-2 text-left text-sm transition-colors disabled:cursor-default disabled:opacity-40 lg:min-h-9 ${active ? 'bg-paper font-semibold text-brand' : 'hover:bg-paper'}`}
                      >
                        <span aria-hidden="true" className={`grid size-4.5 shrink-0 place-items-center rounded-[5px] border transition-colors ${active ? 'border-brand bg-brand text-white' : 'border-line-strong bg-white'}`}>
                          {active && <Check size={12} strokeWidth={3} />}
                        </span>
                        <span className="min-w-0 flex-1">{optionLabel}</span>
                        <span className="text-xs text-mute tabular-nums">{count}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}

          <label className="flex min-h-10 cursor-pointer items-center justify-between gap-3 border-t border-line pt-4 text-sm font-medium">
            En stock uniquement
            <input type="checkbox" className="peer sr-only" checked={filters.availableOnly} onChange={(event) => setFilters((previous) => ({ ...previous, availableOnly: event.target.checked }))} />
            <span aria-hidden="true" className="relative h-6 w-10.5 shrink-0 rounded-full bg-line-strong transition-colors peer-checked:bg-ok peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-4.5" />
          </label>
        </aside>

        <section aria-label="Produits" className="min-w-0">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <p aria-live="polite" className="mr-2 text-sm text-mute">
              {productsLoading && filtered.length === 0
                ? 'Chargement du catalogue…'
                : <><span className="font-semibold text-ink">{filtered.length}</span> produit{filtered.length > 1 ? 's' : ''}</>}
            </p>
            {chips.map(({ id, label, clear }) => (
              <button key={id} type="button" onClick={clear} aria-label={`Retirer le filtre ${label}`} className="inline-flex items-center gap-1.5 rounded-full bg-brand/8 py-1 pr-2 pl-3 text-sm font-medium text-brand hover:bg-brand/15">
                {label} <X size={14} aria-hidden="true" />
              </button>
            ))}
            {(activeFilters > 0 || query) && (
              <button type="button" onClick={resetFilters} className="ml-auto text-sm font-medium text-mute underline-offset-4 hover:text-ink hover:underline">Tout effacer</button>
            )}
          </div>

          {filtered.length > 0 ? (
            <ProductGrid products={filtered} columns="sm:grid-cols-2 xl:grid-cols-3" />
          ) : !productsLoading && (
            <div className="card grid place-items-center px-6 py-16 text-center">
              <h2 className="headline mt-2 text-2xl">Aucun produit trouvé</h2>
              <p className="mt-2 max-w-sm text-sm text-mute">Vérifiez la référence ou retirez un filtre. Si le produit n’est pas au catalogue, demandez-le nous directement.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={resetFilters} className="button-secondary">Effacer la recherche</button>
                <Link href="/contact?subject=product" className="button-primary">Demander un produit</Link>
              </div>
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
  const type = params.get('type') ?? '';
  return (
    <CatalogueContent
      key={params.toString()}
      initialQuery={query}
      initialDomain={domain === 'all' ? '' : domain}
      initialType={Object.hasOwn(PRODUCT_TYPE_LABELS, type) ? type : ''}
    />
  );
}

export default function CataloguePage() {
  return (
    <Suspense fallback={<p className="site-width py-12 text-sm text-mute">Chargement du catalogue…</p>}>
      <CatalogueSearch />
    </Suspense>
  );
}
