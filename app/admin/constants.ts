import { LayoutDashboard, Package, ShoppingCart, Wrench } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export type AppState = ReturnType<typeof useApp>;
export type Product = AppState['products'][number];
export type ProductType = 'equipment' | 'reagent' | 'consumable';

/* Customer that off-site purchases are attached to (same value as before). */
export const OFFLINE_CUSTOMER_ID = 'cust-1';

export const CONTAINER = 'max-w-[1760px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-20';
export const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2';

/* Every input, select and textarea is text-black */
export const INPUT =
  'w-full text-sm text-black placeholder:text-slate-400 border border-slate-300 rounded-xl px-3.5 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-slate-100 disabled:text-slate-500';

export const BTN_PRIMARY = `px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/25 transition inline-flex items-center justify-center gap-2 ${FOCUS}`;
export const BTN_SUCCESS = `px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/25 transition inline-flex items-center justify-center gap-2 ${FOCUS}`;
export const BTN_GHOST = `px-5 py-2.5 bg-white border border-slate-200 text-slate-800 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition rounded-xl inline-flex items-center justify-center gap-2 ${FOCUS}`;

export const TYPE_LABELS: Record<string, string> = {
  equipment: 'Équipement / Analyseur',
  reagent: 'Réactif',
  consumable: 'Consommable',
};

/* Values are the ones your context already uses; labels are display only. */
export const ORDER_STATUSES = [
  { value: 'New', label: 'Nouvelle' },
  { value: 'Contacted', label: 'Client contacté' },
  { value: 'Confirmed', label: 'Confirmée' },
  { value: 'Delivered', label: 'Livrée' },
  { value: 'Cancelled', label: 'Annulée' },
];

export const PROBLEM_STATUSES = [
  { value: 'New', label: 'Nouveau' },
  { value: 'In progress', label: 'En cours' },
  { value: 'Intervention scheduled', label: 'Intervention planifiée' },
  { value: 'Resolved', label: 'Résolu' },
  { value: 'Closed', label: 'Clôturé' },
];

export const TABS = [
  { id: 'stats', label: 'Synthèse', icon: LayoutDashboard },
  { id: 'catalog', label: 'Catalogue & Stocks', icon: Package },
  { id: 'orders', label: 'Demandes & Commandes', icon: ShoppingCart },
  { id: 'sav', label: 'Rapports SAV', icon: Wrench },
] as const;

export type TabId = (typeof TABS)[number]['id'];

export const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=900';

export function statusTone(status: string) {
  switch (status) {
    case 'Delivered':
    case 'Resolved':
    case 'Closed':
      return 'bg-emerald-100 text-emerald-800';
    case 'Confirmed':
    case 'In progress':
      return 'bg-blue-100 text-blue-800';
    case 'Cancelled':
      return 'bg-rose-100 text-rose-800';
    case 'Intervention scheduled':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-amber-100 text-amber-800';
  }
}

export function labelOf(list: { value: string; label: string }[], value: string) {
  return list.find((s) => s.value === value)?.label ?? value;
}