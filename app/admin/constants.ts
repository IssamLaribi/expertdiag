import { LayoutDashboard, Package, ShoppingCart, Wrench } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export type AppState = ReturnType<typeof useApp>;
export type Product = AppState['products'][number];
export type ProductType = 'equipment' | 'reagent' | 'consumable';

/* Customer that off-site purchases are attached to (same value as before). */
export const OFFLINE_CUSTOMER_ID = 'cust-1';

export const CONTAINER = 'site-width';
/* Focus rings come from globals.css; kept so existing call sites still compile. */
export const FOCUS = '';

export const INPUT = 'field-input disabled:bg-paper disabled:text-mute';

export const BTN_PRIMARY = 'button-primary';
export const BTN_SUCCESS = 'button-primary';
export const BTN_GHOST = 'button-secondary';

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
  { id: 'catalog', label: 'Catalogue et stock', icon: Package },
  { id: 'orders', label: 'Demandes', icon: ShoppingCart },
  { id: 'sav', label: 'SAV', icon: Wrench },
] as const;

export type TabId = (typeof TABS)[number]['id'];

export const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=900';

/** Text colour for a `.tag` status marker. */
export function statusTone(status: string) {
  switch (status) {
    case 'Delivered':
    case 'Resolved':
      return 'text-ok';
    case 'Closed':
    case 'Cancelled':
      return 'text-mute';
    case 'Confirmed':
    case 'Contacted':
    case 'In progress':
    case 'Intervention scheduled':
      return 'text-brand';
    default:
      return 'text-amber-700';
  }
}

export function labelOf(list: { value: string; label: string }[], value: string) {
  return list.find((s) => s.value === value)?.label ?? value;
}