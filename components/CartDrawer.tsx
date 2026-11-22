'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { CheckCircle2, Minus, Plus, Trash2, X } from 'lucide-react';
import { ProductImage } from '@/components/ProductImage';
import { Price } from '@/components/ProductList';
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

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="quote-title"
      onCancel={close}
      onClick={(event) => { if (event.target === event.currentTarget) close(); }}
      className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-[34rem] overflow-hidden bg-white p-0 text-ink shadow-[-30px_0_60px_-30px_rgb(7_22_52/0.45)] backdrop:bg-night/45 backdrop:backdrop-blur-[2px] sm:rounded-l-3xl"
    >
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-7">
          <div>
            <h2 id="quote-title" className="headline text-[1.4rem] leading-tight">Ma demande de devis</h2>
            <p className="mt-0.5 text-sm text-mute">{itemCount} article{itemCount > 1 ? 's' : ''}</p>
          </div>
          <button type="button" onClick={close} aria-label="Fermer la demande" className="grid size-10 place-items-center rounded-full bg-paper text-ink/70 hover:bg-paper-deep hover:text-ink">
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        {receipt ? (
          <div role="status" className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
            <div className="grid size-16 place-items-center rounded-full bg-ok/10 text-ok"><CheckCircle2 size={34} strokeWidth={1.75} aria-hidden="true" /></div>
            <h3 className="headline mt-5 text-2xl">Demande envoyée</h3>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-mute">Notre équipe vous répondra aux coordonnées indiquées pour confirmer le prix et la livraison.</p>
            <div className="mt-6 rounded-xl border border-dashed border-line-strong bg-paper px-6 py-3">
              <p className="text-xs text-mute">Numéro de demande</p>
              <p className="mt-0.5 text-xl font-bold tracking-wide tabular-nums">{receipt.reference}</p>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/client" className="button-primary" onClick={close}>Voir mes demandes</Link>
              <Link href="/catalogue" className="button-secondary" onClick={close}>Continuer</Link>
            </div>
          </div>
        ) : cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <Image src="/art/empty-quote.webp" alt="" width={220} height={220} unoptimized className="size-44" />
            <h3 className="headline mt-2 text-xl">Votre demande est vide</h3>
            <p className="mt-2 max-w-xs text-sm text-mute">Ajoutez des produits depuis le catalogue, puis envoyez-nous la liste pour recevoir un devis.</p>
            <Link href="/catalogue" onClick={close} className="button-primary mt-6">Parcourir le catalogue</Link>
          </div>
        ) : (
          <form onSubmit={send} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto px-5 pt-4 pb-8 sm:px-7">
              <ul className="grid gap-3">
                {cart.map(({ product, quantity }) => {
                  const off = !product.visible || product.status !== 'available';
                  return (
                    <li key={product.id} className="flex gap-3.5 rounded-2xl border border-line p-2.5">
                      <ProductImage src={product.image} alt="" className="size-18 shrink-0 rounded-xl" />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm leading-snug font-semibold">{product.name}</p>
                          <button type="button" onClick={() => removeFromCart(product.id)} disabled={sending} aria-label={`Retirer ${product.name}`} className="-mt-1 -mr-1 grid size-8 shrink-0 place-items-center rounded-lg text-mute hover:bg-signal/10 hover:text-signal">
                            <Trash2 size={15} aria-hidden="true" />
                          </button>
                        </div>
                        <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-mute">
                          <span className="ref">{product.reference}</span>
                          {off && <span className="tag text-signal">Indisponible</span>}
                        </p>
                        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                          <Price value={product.priceEstimate} className="text-sm" />
                          <div className="flex items-center rounded-lg border border-line-strong">
                            <button type="button" aria-label={`Diminuer la quantité de ${product.name}`} className="grid size-8 place-items-center text-ink/70 hover:text-ink disabled:opacity-30" onClick={() => updateCartQuantity(product.id, quantity - 1)} disabled={quantity <= 1 || sending}>
                              <Minus size={14} aria-hidden="true" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">{quantity}</span>
                            <button type="button" aria-label={`Augmenter la quantité de ${product.name}`} className="grid size-8 place-items-center text-ink/70 hover:text-ink disabled:opacity-30" onClick={() => updateCartQuantity(product.id, quantity + 1)} disabled={quantity >= 999 || sending}>
                              <Plus size={14} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              {unavailable && <p className="mt-3 rounded-xl bg-signal/8 px-3.5 py-2.5 text-sm text-signal">Retirez les articles indisponibles pour envoyer la demande.</p>}

              <fieldset disabled={sending} className="mt-8 grid gap-x-4 gap-y-4 sm:grid-cols-2">
                <legend className="mb-4 text-base font-semibold">Vos coordonnées</legend>
                {CONTACT_FIELDS.map((field) => (
                  <label key={field.name} className={`field-label ${field.name === 'address' ? 'sm:col-span-2' : ''}`}>
                    {field.label}
                    <input required name={field.name} type={'type' in field ? field.type : 'text'} autoComplete={field.autoComplete}
                      minLength={'minLength' in field ? field.minLength : 2} maxLength={field.maxLength}
                      value={valueFor(field.name)} onChange={(event) => update(field.name, event.target.value)} className="field-input" />
                  </label>
                ))}
                <label className="field-label sm:col-span-2">
                  Mode de livraison
                  <select className="field-input" value={changes.deliveryOptionId ?? activeDelivery[0]?.id ?? ''}
                    onChange={(event) => update('deliveryOptionId', event.target.value)} required>
                    {activeDelivery.map((option) => <option key={option.id} value={option.id}>{option.name} ({option.estimatedDays})</option>)}
                  </select>
                </label>
                <label className="field-label sm:col-span-2">
                  <span>Message <span className="font-normal text-mute">(facultatif)</span></span>
                  <textarea rows={2} className="field-input" maxLength={1500} value={changes.comment ?? ''} onChange={(event) => update('comment', event.target.value)} />
                </label>
              </fieldset>
            </div>
            <div className="border-t border-line bg-white px-5 py-4 sm:px-7">
              {error && <p className="mb-3 rounded-lg bg-signal/8 px-3 py-2 text-sm text-signal" role="alert">{error}</p>}
              <button type="submit" className="button-primary min-h-12 w-full text-[0.9375rem]" disabled={sending || unavailable}>
                {sending ? 'Envoi en cours…' : 'Envoyer la demande de devis'}
              </button>
              <p className="mt-2.5 text-center text-xs text-mute">Sans engagement. Le prix et la livraison sont confirmés par devis.</p>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
}
