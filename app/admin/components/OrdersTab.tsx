'use client';

import React from 'react';
import type { OrderStatus } from '@/types';
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
  onUpdateOrderStatus: (id: string, status: OrderStatus) => void;
}) {
  return (
    <div className="space-y-5">
      <SectionTitle
        title="Demandes clients"
        action={
          <select className={`${INPUT} py-2 sm:w-56`} value={oFilter} onChange={(e) => setOFilter(e.target.value)} aria-label="Filtrer par statut">
            <option value="all">Tous les statuts</option>
            {ORDER_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        }
      />

      {shownOrders.length === 0 ? (
        <Empty message="Aucune demande à afficher." />
      ) : (
        <div className="grid gap-4">
          {shownOrders.map((order) => (
            <article key={order.id} className="card grid grid-cols-[minmax(0,1fr)] gap-x-8 gap-y-4 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_13rem]">
              <div className="min-w-0 space-y-4">
                <header className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className="text-lg font-bold tracking-wide tabular-nums">{order.reference}</h3>
                  <span className={`tag ${statusTone(order.status)}`}>{labelOf(ORDER_STATUSES, order.status)}</span>
                  {order.source === 'admin' && <span className="text-xs text-mute">Saisie hors site</span>}
                </header>
                <p className="text-sm">
                  <span className="font-semibold">{order.laboratoryName}</span>
                  <span className="text-mute"> · {order.customerName}</span>
                </p>

                <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="text-xs text-mute">Contact</dt>
                    <dd className="mt-0.5 break-words">{order.email}<br /><span className="tabular-nums">{order.phone}</span></dd>
                  </div>
                  <div>
                    <dt className="text-xs text-mute">Livraison</dt>
                    <dd className="mt-0.5">{order.deliveryOptionName}<br /><span className="text-mute">{order.address}, {order.wilaya}</span></dd>
                  </div>
                  <div>
                    <dt className="text-xs text-mute">Reçue le</dt>
                    <dd className="mt-0.5 tabular-nums">{order.createdAt}</dd>
                  </div>
                </dl>

                <table className="w-full overflow-hidden rounded-xl bg-paper text-sm">
                  <caption className="sr-only">Articles de la demande {order.reference}</caption>
                  <thead>
                    <tr className="border-b border-line text-left text-xs text-mute">
                      <th scope="col" className="px-4 py-2 font-medium">Article</th>
                      <th scope="col" className="px-4 py-2 font-medium">Référence</th>
                      <th scope="col" className="px-4 py-2 text-right font-medium">Qté</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((i, idx) => (
                      <tr key={idx} className="border-b border-line last:border-0">
                        <td className="px-4 py-2.5 font-medium">{i.productName}</td>
                        <td className="ref px-4 py-2.5 text-mute">{i.reference}</td>
                        <td className="px-4 py-2.5 text-right font-semibold tabular-nums">{i.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {order.comment && <p className="rounded-lg bg-paper px-3.5 py-2.5 text-sm text-mute">{order.comment}</p>}
              </div>

              <label className="field-label content-start">
                Statut
                <select
                  className={INPUT}
                  value={order.status}
                  onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                >
                  {ORDER_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </label>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
