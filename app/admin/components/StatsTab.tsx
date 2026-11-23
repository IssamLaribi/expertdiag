'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import {
  AppState,
  TabId,
  ORDER_STATUSES,
  PROBLEM_STATUSES,
  statusTone,
  labelOf,
} from '../constants';
import { SectionTitle, StatCard } from './AdminUI';

function Queue({
  title,
  emptyMessage,
  onShowAll,
  children,
}: {
  title: string;
  emptyMessage: string;
  onShowAll: () => void;
  children: React.ReactNode[];
}) {
  return (
    <section className="card p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-3 border-b border-line pb-3">
        <h3 className="font-semibold">{title}</h3>
        <button type="button" onClick={onShowAll} className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
          Tout voir <ArrowRight size={14} aria-hidden="true" />
        </button>
      </div>
      {children.length === 0 ? <p className="py-6 text-sm text-mute">{emptyMessage}</p> : <ul className="divide-y divide-line">{children}</ul>}
    </section>
  );
}

export function StatsTab({
  products,
  orders,
  newOrders,
  activeProblems,
  urgentProblems,
  availableCount,
  onSelectTab,
}: {
  products: AppState['products'];
  orders: AppState['orders'];
  newOrders: AppState['orders'];
  activeProblems: AppState['problems'];
  urgentProblems: AppState['problems'];
  availableCount: number;
  onSelectTab: (tab: TabId) => void;
}) {
  return (
    <div className="space-y-6"> 
      <SectionTitle title="Synthèse" />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Produits" value={products.length} hint={`${availableCount} en stock`} />
        <StatCard label="Demandes" value={orders.length} hint={newOrders.length > 0 ? `${newOrders.length} à traiter` : 'Rien à traiter'} />
        <StatCard
          label="SAV ouverts"
          value={activeProblems.length}
          hint={urgentProblems.length > 0 ? `${urgentProblems.length} urgent${urgentProblems.length > 1 ? 's' : ''}` : 'Aucun urgent'}
          alert={urgentProblems.length > 0}
        />
        <StatCard label="Indisponibles" value={products.length - availableCount} hint="Produits hors stock" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Queue title="Dernières demandes" emptyMessage="Aucune demande pour le moment." onShowAll={() => onSelectTab('orders')}>
          {orders.slice(0, 5).map((o) => (
            <li key={o.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="font-semibold tracking-wide tabular-nums">{o.reference}</p>
                <p className="mt-0.5 line-clamp-1 text-xs text-mute">{o.laboratoryName}</p>
              </div>
              <span className={`tag shrink-0 ${statusTone(o.status)}`}>{labelOf(ORDER_STATUSES, o.status)}</span>
            </li>
          ))}
        </Queue>

        <Queue title="SAV à traiter" emptyMessage="Aucun signalement ouvert." onShowAll={() => onSelectTab('sav')}>
          {activeProblems.slice(0, 5).map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="font-semibold tracking-wide tabular-nums">
                  {p.reference}
                  {p.urgency === 'urgent' && <span className="ml-2 rounded-full bg-signal px-2 py-0.5 text-[0.6875rem] font-semibold tracking-normal text-white">Urgent</span>}
                </p>
                <p className="mt-0.5 line-clamp-1 text-xs text-mute">{p.equipmentName}</p>
              </div>
              <span className={`tag shrink-0 ${statusTone(p.status)}`}>{labelOf(PROBLEM_STATUSES, p.status)}</span>
            </li>
          ))}
        </Queue>
      </div>
    </div>
  );
}
