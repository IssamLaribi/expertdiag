'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { QuoteDetails, SubmissionReceipt } from '@/types';

const CONTACT_FIELDS = [
  { name: 'laboratoryName', label: 'Laboratoire', autoComplete: 'organization', maxLength: 160 },
  { name: 'contactPerson', label: 'Nom du contact', autoComplete: 'name', maxLength: 120 },
  { name: 'email', label: 'Adresse e-mail', type: 'email', autoComplete: 'email', maxLength: 254 },
  { name: 'phone', label: 'Téléphone', type: 'tel', autoComplete: 'tel', minLength: 6, maxLength: 40 },
  { name: 'wilaya', label: 'Wilaya', autoComplete: 'address-level1', maxLength: 100 },
  { name: 'commune', label: 'Commune', autoComplete: 'address-level2', maxLength: 100 },
  { name: 'address', label: 'Adresse de livraison', autoComplete: 'street-address', maxLength: 240 },
] as const;

export function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { cart, removeFromCart, updateCartQuantity, deliveryOptions, submitOrder, currentCustomer, customerSaved } = useApp();
  const dialog = useRef<HTMLDialogElement>(null);
  const request = useRef<{ key: string; id: string } | null>(null);
  const inFlight = useRef(false);
  const [changes, setChanges] = useState<Partial<QuoteDetails>>({});
  const [receipt, setReceipt] = useState<SubmissionReceipt>();
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const activeDelivery = deliveryOptions.filter(({ active }) => active);
  const unavailable = cart.some(({ product }) => !product.visible || product.status !== 'available');

  function valueFor(field: typeof CONTACT_FIELDS[number]['name']) {
    return changes[field] ?? (customerSaved ? currentCustomer[field] : '');
  }

  function update(field: keyof QuoteDetails, value: string) {
    setChanges((previous) => ({ ...previous, [field]: value }));
  }

  useEffect(() => {
    if (isOpen && !dialog.current?.open) dialog.current?.showModal();
    if (!isOpen && dialog.current?.open) dialog.current.close();
  }, [isOpen]);

  function close() {
    setReceipt(undefined);
    onClose();
  }

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || unavailable || cart.length === 0) return;
    const details: QuoteDetails = {
      laboratoryName: valueFor('laboratoryName').trim(),
      contactPerson: valueFor('contactPerson').trim(),
      email: valueFor('email').trim(),
      phone: valueFor('phone').trim(),
      wilaya: valueFor('wilaya').trim(),
      commune: valueFor('commune').trim(),
      address: valueFor('address').trim(),
      deliveryOptionId: changes.deliveryOptionId ?? activeDelivery[0]?.id ?? '',
      comment: changes.comment?.trim() ?? '',
    };
    const key = JSON.stringify([details, cart.map(({ product, quantity }) => [product.id, quantity])]);
    inFlight.current = true;
    setSending(true);
    setError('');
    try {
      if (request.current?.key !== key) request.current = { key, id: crypto.randomUUID() };
      const result = await submitOrder(details, request.current.id);
      setReceipt(result);
      setChanges({});
      request.current = null;
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'La demande n’a pas pu être enregistrée.');
    } finally {
      inFlight.current = false;
      setSending(false);
    }
  }

  return (
    <dialog
      ref={dialog}
      aria-labelledby="quote-title"
      onCancel={close}
      onClick={(event) => { if (event.target === event.currentTarget) close(); }}
      className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-xl overflow-hidden border-l border-line bg-white p-0 text-ink backdrop:bg-slate-950/40"
    >
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
          <h2 id="quote-title" className="flex items-center gap-2 text-lg font-semibold">
            <ShoppingCart size={18} className="text-brand" aria-hidden="true" /> Ma demande
          </h2>
          <button type="button" onClick={close} aria-label="Fermer la demande" className="button-secondary min-w-11 px-0">
            <X size={19} aria-hidden="true" />
          </button>
        </header>

        {receipt ? (
          <div role="status" className="space-y-3 p-6">
            <h3 className="text-xl font-semibold">Demande reçue</h3>
            <p className="text-sm text-slate-700">Référence <strong>{receipt.reference}</strong></p>
            <p className="text-sm text-slate-700">Notre équipe vous répondra aux coordonnées indiquées pour confirmer le prix et la livraison.</p>
            <button type="button" className="button-secondary mt-2" onClick={close}>Retour au catalogue</button>
          </div>
        ) : cart.length === 0 ? (
          <div className="space-y-4 p-6">
            <p className="text-sm text-slate-700">Votre demande est vide.</p>
            <Link href="/catalogue" onClick={close} className="button-secondary">Voir le catalogue</Link>
          </div>
        ) : (
          <form onSubmit={send} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
              <ul className="divide-y divide-line">
                {cart.map(({ product, quantity }) => (
                  <li key={product.id} className="space-y-2 py-3 first:pt-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">{product.name}</p>
                        <p className="mt-1 text-xs text-slate-600">{product.reference}</p>
                      </div>
                      <button type="button" onClick={() => removeFromCart(product.id)} disabled={sending} aria-label={`Retirer ${product.name}`} className="button-secondary min-w-11 px-0">
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <button type="button" aria-label={`Diminuer la quantité de ${product.name}`} className="button-secondary min-w-11 px-0" onClick={() => updateCartQuantity(product.id, quantity - 1)} disabled={quantity <= 1 || sending}>
                        <Minus size={16} aria-hidden="true" />
                      </button>
                      <span className="min-w-7 text-center tabular-nums" aria-live="polite">{quantity}</span>
                      <button type="button" aria-label={`Augmenter la quantité de ${product.name}`} className="button-secondary min-w-11 px-0" onClick={() => updateCartQuantity(product.id, quantity + 1)} disabled={quantity >= 999 || sending}>
                        <Plus size={16} aria-hidden="true" />
                      </button>
                      {(!product.visible || product.status !== 'available') && <span className="text-sm text-rose-800">Indisponible</span>}
                    </div>
                  </li>
                ))}
              </ul>
              {unavailable && <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-900">Retirez les articles indisponibles pour envoyer la demande.</p>}
              <fieldset disabled={sending} className="grid gap-3 border-t border-line pt-4 sm:grid-cols-2">
                <legend className="pr-3 font-semibold">Coordonnées et livraison</legend>
                {CONTACT_FIELDS.map((field) => (
                  <label key={field.name} className={`grid min-w-0 gap-1.5 text-sm font-medium ${field.name === 'address' ? 'sm:col-span-2' : ''}`}>
                    {field.label}
                    <input required name={field.name} type={'type' in field ? field.type : 'text'} autoComplete={field.autoComplete}
                      minLength={'minLength' in field ? field.minLength : 2} maxLength={field.maxLength}
                      value={valueFor(field.name)} onChange={(event) => update(field.name, event.target.value)} className="field-input" />
                  </label>
                ))}
                <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
                  Mode de livraison
                  <select className="field-input" value={changes.deliveryOptionId ?? activeDelivery[0]?.id ?? ''}
                    onChange={(event) => update('deliveryOptionId', event.target.value)} required>
                    {activeDelivery.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
                  </select>
                </label>
                <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
                  Message (facultatif)
                  <textarea rows={2} className="field-input" maxLength={1500} value={changes.comment ?? ''} onChange={(event) => update('comment', event.target.value)} />
                </label>
              </fieldset>
            </div>
            <div className="space-y-2 border-t border-line bg-paper px-5 py-3">
              {error && <p className="text-sm text-rose-800" role="alert">{error}</p>}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-600">Le prix et la livraison seront confirmés par devis.</p>
                <button type="submit" className="button-primary" disabled={sending || unavailable}>
                  {sending ? 'Envoi en cours…' : 'Envoyer la demande'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
}
