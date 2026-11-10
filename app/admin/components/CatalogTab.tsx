'use client';

import React from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Pencil,
} from 'lucide-react';
import {
  AppState,
  Product,
  INPUT,
  BTN_PRIMARY,
  FOCUS,
  TYPE_LABELS,
} from '../constants';
import { SectionTitle, Empty } from './AdminUI';

export function CatalogTab({
  filteredProducts,
  domains,
  query,
  setQuery,
  fDomain,
  setFDomain,
  fType,
  setFType,
  fStatus,
  setFStatus,
  onOpenAddModal,
  onToggleAvailability,
  onRemoveProduct,
}: {
  filteredProducts: Product[];
  domains: AppState['domains'];
  query: string;
  setQuery: (v: string) => void;
  fDomain: string;
  setFDomain: (v: string) => void;
  fType: string;
  setFType: (v: string) => void;
  fStatus: string;
  setFStatus: (v: string) => void;
  onOpenAddModal: () => void;
  onToggleAvailability: (id: string) => void;
  onRemoveProduct: (p: Product) => void;
}) {
  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="Catalogue"
        title="Produits & disponibilité"
        action={
          <button onClick={onOpenAddModal} className={BTN_PRIMARY}>
            <Plus className="w-4 h-4" />
            Ajouter un produit
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input className={`${INPUT} pl-10`} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nom, marque, référence..." />
        </div>
        <select className={INPUT} value={fDomain} onChange={(e) => setFDomain(e.target.value)}>
          <option value="all">Tous les domaines</option>
          {domains.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
        </select>
        <select className={INPUT} value={fType} onChange={(e) => setFType(e.target.value)}>
          <option value="all">Tous les types</option>
          <option value="equipment">Équipement / Analyseur</option>
          <option value="reagent">Réactif</option>
          <option value="consumable">Consommable</option>
        </select>
        <select className={INPUT} value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
          <option value="all">Tous les statuts</option>
          <option value="available">Disponible</option>
          <option value="unavailable">Indisponible</option>
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <Empty message="Aucun produit ne correspond à votre recherche." />
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4">Produit</th>
                  <th className="px-5 py-4">Domaine</th>
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4">Tarif</th>
                  <th className="px-5 py-4">Disponibilité</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4 min-w-[260px]">
                        <img src={p.image} alt={p.name} className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 line-clamp-1">{p.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            <span className="font-mono font-bold text-blue-600">{p.reference}</span> · {p.brand}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-700">{p.domain}</td>
                    <td className="px-5 py-4 text-slate-700">{TYPE_LABELS[p.type] ?? p.type}</td>
                    <td className="px-5 py-4 font-semibold text-slate-900">{p.priceEstimate || 'Sur devis'}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => onToggleAvailability(p.id)}
                        title="Cliquer pour changer la disponibilité"
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 w-fit ${FOCUS} ${p.status === 'available' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                          }`}
                      >
                        {p.status === 'available' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                        <span>{p.status === 'available' ? 'Disponible' : 'Indisponible'}</span>
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/catalogue/${p.id}`} aria-label="Voir la fiche publique" className={`p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition ${FOCUS}`}>
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                        <button onClick={() => {}} aria-label="Modifier" title="Modifier" className={`p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition ${FOCUS}`}>
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => onRemoveProduct(p)} aria-label="Supprimer" title="Supprimer" className={`p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition ${FOCUS}`}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}