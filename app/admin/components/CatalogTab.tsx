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
        <h2 className="text-xl font-semibold">Produits et stock</h2>
        <button type="button" onClick={onOpenAddModal} disabled={productsLoading} className="button-primary">
          <Plus size={17} aria-hidden="true" /> Ajouter un produit
        </button>
      </div>

      <div className="grid gap-3 rounded-lg border border-line bg-white p-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="relative">
          <Search size={17} aria-hidden="true" className="pointer-events-none absolute top-3 left-3 text-slate-500" />
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

      {error && <p role="alert" className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">{error}</p>}
      {filteredProducts.length === 0 ? (
        <p className="rounded-lg border border-line bg-white p-4 text-sm text-slate-700">
          {productsLoading ? 'Chargement du catalogue…' : 'Aucun produit ne correspond à cette recherche.'}
        </p>
      ) : (
        <ul className="divide-y divide-line rounded-lg border border-line bg-white">
          {filteredProducts.map((product) => {
            const available = product.status === 'available';
            const updating = busy.includes(product.id);
            const disabled = productsLoading || updating;
            return (
              <li key={product.id} className="grid items-center gap-3 p-3 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto_auto]">
                <div className="flex min-w-0 items-center gap-3">
                  <ProductImage src={product.image} alt="" className="size-14 shrink-0 rounded-md border border-line" />
                  <div className="min-w-0 text-sm">
                    <h3 className="font-semibold break-words">{product.name}</h3>
                    <p className="mt-0.5 text-xs break-words text-slate-600">{product.reference} · {product.brand}</p>
                    {!product.visible && <p className="mt-0.5 text-xs text-slate-600">Masqué du catalogue</p>}
                  </div>
                </div>

                <div className="text-sm">
                  <p>{product.domain} · {PRODUCT_TYPE_LABELS[product.type]}</p>
                  <p className="text-xs text-slate-600">{product.priceEstimate || 'Sur devis'}</p>
                </div>

                <button
                  type="button"
                  className={`min-h-11 w-fit rounded-md border px-3 text-xs font-semibold disabled:opacity-55 ${available ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-line bg-paper text-slate-700'}`}
                  aria-label={`Marquer ${product.name} ${available ? 'indisponible' : 'disponible'}`}
                  disabled={disabled}
                  onClick={() => void change(product, () => onToggleAvailability(product.id))}
                >
                  {updating ? 'Enregistrement…' : available ? 'Disponible' : 'Indisponible'}
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
                  <button type="button" className="button-secondary min-w-11 px-0 text-rose-800" aria-label={`Supprimer ${product.name}`}
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
