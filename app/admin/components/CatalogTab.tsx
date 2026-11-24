'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { ProductImage } from '@/components/ProductImage';
import { PRODUCT_TYPE_LABELS } from '@/lib/catalogue';
import type { Domain, Product } from '@/types';

export function CatalogTab({
  filteredProducts, domains, productsLoading, query, setQuery, fDomain, setFDomain,
  fType, setFType, fStatus, setFStatus, onOpenAddModal, onEditProduct, onToggleAvailability, onRemoveProduct,
}: {
  filteredProducts: Product[];
  domains: Domain[];
  productsLoading: boolean;
  query: string;
  setQuery: (value: string) => void;
  fDomain: string;
  setFDomain: (value: string) => void;
  fType: string;
  setFType: (value: string) => void;
  fStatus: string;
  setFStatus: (value: string) => void;
  onOpenAddModal: () => void;
  onEditProduct: (product: Product) => void;
  onToggleAvailability: (id: string) => Promise<void>;
  onRemoveProduct: (product: Product) => Promise<void>;
}) {
  const requests = useRef(new Set<string>());
  const [busy, setBusy] = useState<string[]>([]);
  const [error, setError] = useState('');

  async function change(product: Product, action: () => Promise<void>) {
    if (productsLoading || requests.current.has(product.id)) return;
    requests.current.add(product.id);
    setBusy((previous) => [...previous, product.id]);
    setError('');
    try {
      await action();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'La modification n’a pas été enregistrée.');
    } finally {
      requests.current.delete(product.id);
      setBusy((previous) => previous.filter((id) => id !== product.id));
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="headline text-[1.6rem] leading-tight">Catalogue et stock</h2>
        <button type="button" onClick={onOpenAddModal} disabled={productsLoading} className="button-primary">
          <Plus size={17} aria-hidden="true" /> Ajouter un produit
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.6fr)_1fr_1fr_1fr]">
        <div className="relative">
          <Search size={17} aria-hidden="true" className="pointer-events-none absolute top-3 left-3 text-mute" />
          <input aria-label="Rechercher un produit" type="search" className="field-input pl-9" value={query}
            onChange={(event) => setQuery(event.target.value)} placeholder="Nom ou référence" />
        </div>
        <select aria-label="Spécialité" className="field-input" value={fDomain} onChange={(event) => setFDomain(event.target.value)}>
          <option value="all">Toutes les spécialités</option>
          {domains.map((domain) => <option key={domain.id} value={domain.name}>{domain.name}</option>)}
        </select>
        <select aria-label="Type de produit" className="field-input" value={fType} onChange={(event) => setFType(event.target.value)}>
          <option value="all">Tous les types</option>
          {Object.entries(PRODUCT_TYPE_LABELS).map(([type, label]) => <option key={type} value={type}>{label}</option>)}
        </select>
        <select aria-label="Disponibilité" className="field-input" value={fStatus} onChange={(event) => setFStatus(event.target.value)}>
          <option value="all">Tous les statuts</option>
          <option value="available">Disponible</option>
          <option value="unavailable">Indisponible</option>
        </select>
      </div>

      {error && <p role="alert" className="rounded-lg bg-signal/8 px-3.5 py-2.5 text-sm text-signal">{error}</p>}
      {filteredProducts.length === 0 ? (
        <p className="card px-6 py-12 text-center text-sm text-mute">
          {productsLoading ? 'Chargement du catalogue…' : 'Aucun produit ne correspond à cette recherche.'}
        </p>
      ) : (
        <ul className="card divide-y divide-line overflow-hidden">
          {filteredProducts.map((product) => {
            const available = product.status === 'available';
            const updating = busy.includes(product.id);
            const disabled = productsLoading || updating;
            return (
              <li key={product.id} className={`grid items-center gap-3 px-4 py-3 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_8.5rem_auto] ${product.visible ? '' : 'opacity-70'}`}>
                <div className="flex min-w-0 items-center gap-3">
                  <ProductImage src={product.image} alt="" className="size-14 shrink-0 rounded-xl" />
                  <div className="min-w-0 text-sm">
                    <h3 className="font-semibold break-words">{product.name}</h3>
                    <p className="mt-0.5 text-xs break-words text-mute"><span className="ref text-ink">{product.reference}</span> · {product.brand}</p>
                    {!product.visible && <p className="mt-0.5 text-xs font-medium text-amber-700">Masqué du site public</p>}
                  </div>
                </div>

                <div className="text-sm">
                  <p>{product.domain} · {PRODUCT_TYPE_LABELS[product.type]}</p>
                  <p className="text-xs text-mute">{product.priceEstimate || 'Sur devis'}</p>
                </div>

                <button
                  type="button"
                  className="flex min-h-10 w-fit items-center gap-2 rounded-lg border border-line px-2 text-xs hover:border-line-strong hover:bg-paper disabled:opacity-55"
                  aria-label={`Marquer ${product.name} ${available ? 'indisponible' : 'disponible'}`}
                  disabled={disabled}
                  onClick={() => void change(product, () => onToggleAvailability(product.id))}
                >
                  {updating ? 'Enregistrement…' : <span className={`tag ${available ? 'text-ok' : 'text-mute'}`}>{available ? 'En stock' : 'Indisponible'}</span>}
                </button>

                <div className="flex flex-wrap items-center gap-2">
                  {product.visible && (
                    <Link href={`/catalogue/${encodeURIComponent(product.id)}`} className="button-secondary min-w-11 px-0" aria-label={`Voir ${product.name}`}>
                      <ArrowUpRight size={17} aria-hidden="true" />
                    </Link>
                  )}
                  <button type="button" className="button-secondary min-w-11 px-0" aria-label={`Modifier ${product.name}`}
                    disabled={disabled} onClick={() => onEditProduct(product)}>
                    <Pencil size={16} aria-hidden="true" />
                  </button>
                  <button type="button" className="button-secondary min-w-11 px-0 hover:border-signal hover:text-signal" aria-label={`Supprimer ${product.name}`}
                    disabled={disabled} onClick={() => void change(product, () => onRemoveProduct(product))}>
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
