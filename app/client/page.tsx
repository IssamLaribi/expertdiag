'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState, type FormEvent } from 'react';
import { useApp } from '@/context/AppContext';
import { INITIAL_ORDERS, INITIAL_PROBLEMS } from '@/data/mockData';
import type { OrderStatus, ProblemStatus, ProblemType, UrgencyLevel } from '@/types';

const DEMO_ORDER_IDS = new Set(INITIAL_ORDERS.map(({ id }) => id));
const DEMO_PROBLEM_IDS = new Set(INITIAL_PROBLEMS.map(({ id }) => id));
const ORDER_STATUS: Record<OrderStatus, string> = {
  New: 'Reçue',
  Contacted: 'Contact établi',
  Confirmed: 'Confirmée',
  Delivered: 'Livrée',
  Cancelled: 'Annulée',
};
const SAV_STATUS: Record<ProblemStatus, string> = {
  New: 'Reçu',
  'In progress': 'En cours',
  'Intervention scheduled': 'Intervention prévue',
  Resolved: 'Résolu',
  Closed: 'Clos',
};
const PROBLEM_TYPES: Record<ProblemType, string> = {
  breakdown: 'Panne',
  calibration: 'Étalonnage',
  error_message: 'Message d’erreur',
  other: 'Autre',
};

const ORDER_TONE: Record<OrderStatus, string> = {
  New: 'text-amber-700',
  Contacted: 'text-brand',
  Confirmed: 'text-brand',
  Delivered: 'text-ok',
  Cancelled: 'text-mute',
};
const SAV_TONE: Record<ProblemStatus, string> = {
  New: 'text-amber-700',
  'In progress': 'text-brand',
  'Intervention scheduled': 'text-brand',
  Resolved: 'text-ok',
  Closed: 'text-mute',
};

function formatDate(date: string) {
  const parsed = new Date(date.replace(' ', 'T'));
  return Number.isNaN(parsed.getTime()) ? date : parsed.toLocaleDateString('fr-DZ');
}

function ServiceForm() {
  const { products, submitProblemReport } = useApp();
  const equipment = products.filter((product) => product.type === 'equipment');
  const [draft, setDraft] = useState({
    equipmentId: '', serialNumber: '', problemType: 'breakdown' as ProblemType, urgency: 'normal' as UrgencyLevel, description: '',
  });
  const request = useRef<{ key: string; id: string } | null>(null);
  const inFlight = useRef(false);
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const [sending, setSending] = useState(false);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setError('');
    setReference('');
    setSending(true);
    try {
      const details = { ...draft, serialNumber: draft.serialNumber.trim(), description: draft.description.trim() };
      const key = JSON.stringify(details);
      if (request.current?.key !== key) request.current = { key, id: crypto.randomUUID() };
      const result = await submitProblemReport(
        details.equipmentId, details.serialNumber, details.problemType, details.description, details.urgency, request.current.id,
      );
      request.current = null;
      setDraft((previous) => ({ ...previous, equipmentId: '', serialNumber: '', description: '' }));
      setReference(result.reference);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Impossible d’envoyer le signalement.');
    } finally {
      inFlight.current = false;
      setSending(false);
    }
  }

  return (
    <form onSubmit={send} className="space-y-5">
      <fieldset disabled={sending} className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
        <label className="field-label sm:col-span-2">
          Équipement
          <select className="field-input" required value={draft.equipmentId}
            onChange={(event) => setDraft((previous) => ({ ...previous, equipmentId: event.target.value }))}>
            <option value="">Choisir un appareil</option>
            {equipment.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        <label className="field-label">
          Numéro de série
          <input required className="field-input" maxLength={120} value={draft.serialNumber}
            onChange={(event) => setDraft((previous) => ({ ...previous, serialNumber: event.target.value }))} />
        </label>
        <label className="field-label">
          Type de demande
          <select className="field-input" value={draft.problemType}
            onChange={(event) => setDraft((previous) => ({ ...previous, problemType: event.target.value as ProblemType }))}>
            {Object.entries(PROBLEM_TYPES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="field-label">
          Priorité
          <select className="field-input" value={draft.urgency}
            onChange={(event) => setDraft((previous) => ({ ...previous, urgency: event.target.value as UrgencyLevel }))}>
            <option value="normal">Normale</option>
            <option value="urgent">Urgente</option>
          </select>
        </label>
        <label className="field-label sm:col-span-2">
          Que se passe-t-il ?
          <textarea required className="field-input" rows={4} minLength={10} maxLength={3000} value={draft.description}
            onChange={(event) => setDraft((previous) => ({ ...previous, description: event.target.value }))} />
        </label>
      </fieldset>
      {reference && <p role="status" className="rounded-lg bg-ok/10 px-3.5 py-2.5 text-sm text-ok">Signalement reçu, référence <span className="font-bold">{reference}</span>.</p>}
      {error && <p role="alert" className="rounded-lg bg-signal/8 px-3.5 py-2.5 text-sm text-signal">{error}</p>}
      <button type="submit" className="button-primary min-h-12 px-5" disabled={sending}>{sending ? 'Envoi en cours…' : 'Envoyer au SAV'}</button>
    </form>
  );
}

export default function ClientPage() {
  const { orders, problems, currentCustomer, customerSaved } = useApp();
  const [view, setView] = useState<'orders' | 'sav'>('orders');
  const myOrders = orders.filter((order) =>
    order.customerId === currentCustomer.id && (customerSaved || !DEMO_ORDER_IDS.has(order.id))
  );
  const myReports = problems.filter((report) =>
    report.customerId === currentCustomer.id && (customerSaved || !DEMO_PROBLEM_IDS.has(report.id))
  );

  const tabs = [
    { id: 'orders', label: 'Mes demandes', count: myOrders.length },
    { id: 'sav', label: 'Service après-vente', count: myReports.length },
  ] as const;

  return (
    <>
      <div className="border-b border-line bg-paper">
        <div className="site-width py-10 sm:py-14">
          <h1 className="page-title">Mon espace</h1>
          <p className="mt-3 text-lg text-mute">
            {customerSaved ? <><span className="font-semibold text-ink">{currentCustomer.laboratoryName}</span> · {currentCustomer.contactPerson}</> : 'Les demandes envoyées depuis ce navigateur apparaissent ici.'}
          </p>
          <div aria-label="Services du laboratoire" className="mt-7 inline-flex gap-1 rounded-xl bg-white p-1 shadow-[0_1px_2px_rgb(7_22_52/0.08)] ring-1 ring-line">
            {tabs.map(({ id, label, count }) => (
              <button key={id} type="button" onClick={() => setView(id)} aria-pressed={view === id}
                className={`flex min-h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors ${view === id ? 'bg-brand text-white' : 'text-ink/70 hover:text-ink'}`}>
                {label}
                {count > 0 && <span className={`rounded-full px-1.5 text-xs tabular-nums ${view === id ? 'bg-white/20' : 'bg-paper'}`}>{count}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="site-width py-10">
        {view === 'orders' ? (
          <section aria-label="Demandes de devis et achats">
            {myOrders.length > 0 ? (
              <ul className="grid gap-4">
                {myOrders.map((order) => (
                  <li key={order.id} className="card grid gap-5 p-5 sm:p-6 md:grid-cols-[13rem_minmax(0,1fr)_auto] md:items-start">
                    <div>
                      <h2 className="text-lg font-bold tracking-wide tabular-nums">{order.reference}</h2>
                      <p className="mt-0.5 text-sm text-mute">Envoyée le {formatDate(order.createdAt)}</p>
                    </div>
                    <ul className="grid gap-2 text-sm">
                      {order.items.map((item, index) => (
                        <li key={`${item.productId}-${index}`} className="flex items-baseline gap-3">
                          <span className="w-9 shrink-0 rounded-md bg-paper py-0.5 text-center text-xs font-semibold tabular-nums">{item.quantity}×</span>
                          <span>{item.productName}</span>
                        </li>
                      ))}
                    </ul>
                    <span className={`tag justify-self-start ${ORDER_TONE[order.status]}`}>{ORDER_STATUS[order.status]}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="card flex flex-col items-center px-6 py-16 text-center">
                <Image src="/art/empty-orders.webp" alt="" width={220} height={220} unoptimized className="size-44" />
                <h2 className="headline mt-2 text-2xl">Aucune demande pour le moment</h2>
                <p className="mt-2 max-w-sm text-sm text-mute">Ajoutez des produits à votre demande depuis le catalogue, puis envoyez-la&nbsp;: elle apparaîtra ici avec son numéro.</p>
                <Link href="/catalogue" className="button-primary mt-6">Parcourir le catalogue</Link>
              </div>
            )}
          </section>
        ) : (
          <section className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]" aria-label="Service après-vente">
            {customerSaved ? (
              <div className="card p-6 sm:p-8">
                <h2 className="headline mb-5 text-2xl">Signaler une panne</h2>
                <ServiceForm />
              </div>
            ) : (
              <div className="card p-6 sm:p-8">
                <h2 className="headline text-2xl">Contacter le service après-vente</h2>
                <p className="mt-2 max-w-md text-sm text-mute">Le formulaire de signalement s’ouvre après votre première demande. En attendant, écrivez-nous avec le modèle et le numéro de série de l’appareil.</p>
                <Link href="/contact?subject=sav" className="button-primary mt-6">Écrire au SAV</Link>
              </div>
            )}
            {myReports.length > 0 && (
              <div className="card p-6">
                <h2 className="font-semibold">Mes signalements</h2>
                <ul className="mt-3 divide-y divide-line">
                  {myReports.map((report) => (
                    <li key={report.id} className="space-y-1.5 py-4 text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold">{report.equipmentName}</p>
                        <span className={`tag ${SAV_TONE[report.status]}`}>{SAV_STATUS[report.status]}</span>
                      </div>
                      <p className="text-xs text-mute"><span className="ref">{report.reference}</span> · {formatDate(report.createdAt)}</p>
                      {report.messageToCustomer && <p className="mt-2 rounded-lg bg-paper px-3 py-2 text-ink/85">{report.messageToCustomer}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}
      </div>
    </>
  );
}
