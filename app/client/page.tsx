'use client';

import Link from 'next/link';
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
    <form onSubmit={send} className="max-w-2xl space-y-4 rounded-lg border border-line p-4 sm:p-5">
      <fieldset disabled={sending} className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
          Équipement
          <select className="field-input" required value={draft.equipmentId}
            onChange={(event) => setDraft((previous) => ({ ...previous, equipmentId: event.target.value }))}>
            <option value="">Choisir un appareil</option>
            {equipment.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          Numéro de série
          <input required className="field-input" maxLength={120} value={draft.serialNumber}
            onChange={(event) => setDraft((previous) => ({ ...previous, serialNumber: event.target.value }))} />
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          Type de demande
          <select className="field-input" value={draft.problemType}
            onChange={(event) => setDraft((previous) => ({ ...previous, problemType: event.target.value as ProblemType }))}>
            {Object.entries(PROBLEM_TYPES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          Priorité
          <select className="field-input" value={draft.urgency}
            onChange={(event) => setDraft((previous) => ({ ...previous, urgency: event.target.value as UrgencyLevel }))}>
            <option value="normal">Normale</option>
            <option value="urgent">Urgente</option>
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
          Que se passe-t-il ?
          <textarea required className="field-input" rows={4} minLength={10} maxLength={3000} value={draft.description}
            onChange={(event) => setDraft((previous) => ({ ...previous, description: event.target.value }))} />
        </label>
      </fieldset>
      {reference && <p role="status" className="text-sm text-emerald-800">Signalement reçu. Référence {reference}.</p>}
      {error && <p role="alert" className="text-sm text-rose-800">{error}</p>}
      <button type="submit" className="button-primary" disabled={sending}>{sending ? 'Envoi en cours…' : 'Envoyer au SAV'}</button>
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

  return (
    <div className="site-width py-8 sm:py-10">
      <h1 className="page-title">Mon espace</h1>
      <p className="mt-3 text-slate-700">
        {customerSaved ? currentCustomer.laboratoryName : 'Retrouvez les demandes envoyées depuis ce navigateur.'}
      </p>

      <div aria-label="Services du laboratoire" className="mt-5 flex flex-wrap gap-2">
        <button type="button" onClick={() => setView('orders')} aria-pressed={view === 'orders'}
          className={view === 'orders' ? 'button-primary' : 'button-secondary'}>
          Mes demandes
        </button>
        <button type="button" onClick={() => setView('sav')} aria-pressed={view === 'sav'}
          className={view === 'sav' ? 'button-primary' : 'button-secondary'}>
          Signaler une panne
        </button>
      </div>

      {view === 'orders' ? (
        <section className="mt-6 border-t border-line pt-5" aria-label="Demandes de devis et achats">
          {myOrders.length > 0 ? (
            <ul className="grid gap-3">
              {myOrders.map((order) => (
                <li key={order.id} className="rounded-lg border border-line p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="font-semibold">{order.reference}</h2>
                    <p className="text-sm text-slate-700">{ORDER_STATUS[order.status]} · {formatDate(order.createdAt)}</p>
                  </div>
                  <ul className="mt-3 space-y-1 text-sm text-slate-700">
                    {order.items.map((item, index) => <li key={`${item.productId}-${index}`}>{item.quantity} × {item.productName}</li>)}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <div className="space-y-3 rounded-lg border border-line bg-paper p-5">
              <h2 className="font-semibold">Aucune demande pour le moment</h2>
              <p className="text-sm text-slate-700">Ajoutez un produit à votre demande depuis le catalogue.</p>
              <Link href="/catalogue" className="button-secondary">Voir le catalogue</Link>
            </div>
          )}
        </section>
      ) : (
        <section className="mt-6 space-y-5 border-t border-line pt-5" aria-label="Service après-vente">
          {customerSaved ? (
            <ServiceForm />
          ) : (
            <div className="space-y-3 rounded-lg border border-line bg-paper p-5">
              <h2 className="font-semibold">Contacter le service après-vente</h2>
              <p className="text-sm text-slate-700">Indiquez vos coordonnées, le modèle et le numéro de série de l’appareil.</p>
              <Link href="/contact?subject=sav" className="button-primary">Écrire au SAV</Link>
            </div>
          )}
          {myReports.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold">Mes signalements</h2>
              <ul className="mt-3 grid gap-3">
                {myReports.map((report) => (
                  <li key={report.id} className="space-y-1 rounded-lg border border-line p-4 text-sm">
                    <p className="font-semibold">{report.equipmentName}</p>
                    <p className="text-slate-700">{report.reference} · {SAV_STATUS[report.status]} · {formatDate(report.createdAt)}</p>
                    {report.messageToCustomer && <p className="mt-2 text-slate-700">{report.messageToCustomer}</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
