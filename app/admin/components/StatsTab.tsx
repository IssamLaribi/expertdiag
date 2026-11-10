'use client';

import React from 'react';
import {
  AppState,
  TabId,
  ORDER_STATUSES,
  PROBLEM_STATUSES,
  FOCUS,
  statusTone,
  labelOf,
} from '../constants';
import { SectionTitle, StatCard } from './AdminUI';

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
    <div className="space-y-10">
      <SectionTitle eyebrow="Synthèse" title="Vue d’ensemble" />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard label="Total produits" value={products.length} hint="Catalogue actif" tone="slate" />
        <StatCard label="Demandes reçues" value={orders.length} hint={`${newOrders.length} à traiter`} tone="blue" />
        <StatCard label="Tickets SAV actifs" value={activeProblems.length} hint={`${urgentProblems.length} urgent(s)`} tone="amber" />
        <StatCard label="Disponibilité stock" value={`${availableCount} / ${products.length}`} hint="Produits disponibles" tone="emerald" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900">Dernières demandes</h3>
            <button onClick={() => onSelectTab('orders')} className={`text-sm font-bold text-blue-600 hover:text-blue-800 rounded-lg ${FOCUS}`}>Tout voir</button>
          </div>
          {orders.length === 0 ? (
            <p className="text-sm text-slate-500">Aucune demande pour le moment.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {orders.slice(0, 5).map((o) => (
                <li key={o.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono font-bold text-blue-600 text-sm">{o.reference}</p>
                    <p className="text-xs text-slate-500 line-clamp-1">{o.laboratoryName}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${statusTone(o.status)}`}>{labelOf(ORDER_STATUSES, o.status)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900">SAV à traiter</h3>
            <button onClick={() => onSelectTab('sav')} className={`text-sm font-bold text-blue-600 hover:text-blue-800 rounded-lg ${FOCUS}`}>Tout voir</button>
          </div>
          {activeProblems.length === 0 ? (
            <p className="text-sm text-slate-500">Aucun signalement ouvert.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {activeProblems.slice(0, 5).map((p) => (
                <li key={p.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono font-bold text-blue-600 text-sm">{p.reference}</p>
                    <p className="text-xs text-slate-500 line-clamp-1">{p.equipmentName}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {p.urgency === 'urgent' && <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full">Urgent</span>}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusTone(p.status)}`}>{labelOf(PROBLEM_STATUSES, p.status)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}