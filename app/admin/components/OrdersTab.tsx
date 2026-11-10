'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import {
  AppState,
  ORDER_STATUSES,
  INPUT,
  statusTone,
  labelOf,
} from '../constants';
import { SectionTitle, Empty } from './AdminUI';

export function OrdersTab({
  shownOrders,
  oFilter,
  setOFilter,
  onUpdateOrderStatus,
}: {
  shownOrders: AppState['orders'];
  oFilter: string;
  setOFilter: (v: string) => void;
  onUpdateOrderStatus: (id: string, status: any) => void;
}) {
  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="Ventes"
        title="Demandes & commandes clients"
        action={
          <select className={`${INPUT} sm:w-60`} value={oFilter} onChange={(e) => setOFilter(e.target.value)} aria-label="Filtrer par statut">
            <option value="all">Tous les statuts</option>
            {ORDER_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        }
      />

      {shownOrders.length === 0 ? (
        <Empty message="Aucune demande à afficher." />
      ) : (
        <div className="space-y-5">
          {shownOrders.map((order) => (
            <article key={order.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono font-bold text-blue-600 text-base">{order.reference}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusTone(order.status)}`}>{labelOf(ORDER_STATUSES, order.status)}</span>
                  <span className="text-sm font-bold text-slate-900">{order.laboratoryName} <span className="font-medium text-slate-500">({order.customerName})</span></span>
                </div>
                <select
                  aria-label="Changer le statut"
                  className={`${INPUT} md:w-56`}
                  value={order.status}
                  onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as any)}
                >
                  {ORDER_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-sm">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Contact</p>
                  <p className="text-slate-800">{order.email} | {order.phone}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Livraison</p>
                  <p className="text-slate-800">{order.deliveryOptionName} - {order.address}, {order.wilaya}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date</p>
                  <p className="text-slate-800 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" />{order.createdAt}</p>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Articles de la demande</p>
                <ul className="space-y-2">
                  {order.items.map((i, idx) => (
                    <li key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 bg-slate-50 px-4 py-3 rounded-xl text-sm">
                      <span className="font-semibold text-slate-800">
                        {i.productName} <span className="font-mono text-blue-600">({i.reference})</span>
                      </span>
                      <span className="font-bold text-slate-900">Qté : {i.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}