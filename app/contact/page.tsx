'use client';

import { Suspense, useRef, useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail, Phone } from 'lucide-react';
import { jsonRequest, requestJson } from '@/lib/api';
import type { SubmissionReceipt } from '@/types';

const SUBJECTS = {
  quote: 'Demande de devis',
  product: 'Information sur un produit',
  availability: 'Disponibilité d’un produit',
  sav: 'Service après-vente',
  partnership: 'Partenariat',
  other: 'Autre demande',
} as const;

type Subject = keyof typeof SUBJECTS;

const CONTACT_FIELDS = [
  { field: 'contactPerson', label: 'Votre nom', type: 'text', autoComplete: 'name', minLength: 2, maxLength: 120 },
  { field: 'laboratoryName', label: 'Laboratoire ou société', type: 'text', autoComplete: 'organization', minLength: 2, maxLength: 160 },
  { field: 'email', label: 'Adresse e-mail', type: 'email', autoComplete: 'email', minLength: 3, maxLength: 254 },
  { field: 'phone', label: 'Téléphone', type: 'tel', autoComplete: 'tel', minLength: 6, maxLength: 40 },
] as const;

function ContactForm({ initialSubject, product, reference }: { initialSubject: Subject; product: string; reference: string }) {
  const [draft, setDraft] = useState({
    contactPerson: '', laboratoryName: '', email: '', phone: '',
    subject: initialSubject,
    message: initialSubject === 'availability' && (product || reference)
      ? 'Bonjour, pouvez-vous m’indiquer quand ce produit sera disponible ?'
      : '',
  });
  const request = useRef<{ key: string; id: string } | null>(null);
  const inFlight = useRef(false);
  const [sending, setSending] = useState(false);
  const [receipt, setReceipt] = useState<SubmissionReceipt>();
  const [error, setError] = useState('');
  const hasProduct = draft.subject === 'availability' && Boolean(product || reference);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setSending(true);
    setError('');

    const details = {
      contactPerson: draft.contactPerson.trim(),
      laboratoryName: draft.laboratoryName.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      subject: draft.subject,
      message: draft.message.trim(),
      productName: hasProduct ? product : '',
      productReference: hasProduct ? reference : '',
    };
    try {
      const key = JSON.stringify(details);
      if (request.current?.key !== key) request.current = { key, id: crypto.randomUUID() };
      setReceipt(await requestJson<SubmissionReceipt>('/contact-messages', jsonRequest('POST', {
        ...details, submissionId: request.current.id,
      })));
      request.current = null;
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Impossible d’envoyer votre message.');
    } finally {
      inFlight.current = false;
      setSending(false);
    }
  }

  if (receipt) {
    return (
      <div role="status" className="space-y-3 rounded-lg border border-line p-5 sm:p-6">
        <h2 className="text-xl font-semibold">Message reçu</h2>
        <p className="text-sm text-slate-700">Référence <strong>{receipt.reference}</strong></p>
        <p className="text-sm text-slate-700">Notre équipe vous répondra aux coordonnées indiquées.</p>
        <button type="button" className="button-secondary" onClick={() => {
          setDraft((previous) => ({ ...previous, subject: 'other', message: '' }));
          setReceipt(undefined);
        }}>Écrire un autre message</button>
      </div>
    );
  }

  return (
    <form onSubmit={send} className="space-y-4 rounded-lg border border-line p-5 sm:p-6">
      <h2 className="text-xl font-semibold">Écrivez-nous</h2>
      <fieldset disabled={sending} className="grid gap-4 sm:grid-cols-2">
        {CONTACT_FIELDS.map(({ field, label, type, autoComplete, minLength, maxLength }) => (
          <label key={field} className="grid min-w-0 gap-1.5 text-sm font-medium">
            {label}
            <input
              required name={field} type={type} autoComplete={autoComplete} minLength={minLength} maxLength={maxLength}
              value={draft[field]} className="field-input"
              onChange={(event) => setDraft((previous) => ({ ...previous, [field]: event.target.value }))}
            />
          </label>
        ))}
        <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
          Sujet
          <select className="field-input" name="subject" value={draft.subject}
            onChange={(event) => setDraft((previous) => ({ ...previous, subject: event.target.value as Subject }))}>
            {Object.entries(SUBJECTS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        {hasProduct && (
          <p className="rounded-md bg-paper p-3 text-sm text-slate-700 sm:col-span-2">
            {[product, reference && `réf. ${reference}`].filter(Boolean).join(' · ')}
          </p>
        )}
        <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
          Votre message
          <textarea required name="message" rows={5} minLength={10} maxLength={3000} value={draft.message} className="field-input"
            onChange={(event) => setDraft((previous) => ({ ...previous, message: event.target.value }))} />
        </label>
      </fieldset>
      {error && <p role="alert" className="text-sm text-rose-800">{error}</p>}
      <button type="submit" className="button-primary" disabled={sending}>{sending ? 'Envoi en cours…' : 'Envoyer le message'}</button>
    </form>
  );
}

function ContactQuery() {
  const params = useSearchParams();
  const subject = params.get('subject');
  const initialSubject = subject && Object.hasOwn(SUBJECTS, subject) ? subject as Subject : 'other';
  const product = (params.get('product') ?? '').trim().slice(0, 180);
  const reference = (params.get('reference') ?? '').trim().slice(0, 100);
  return <ContactForm key={params.toString()} initialSubject={initialSubject} product={product} reference={reference} />;
}

export default function ContactPage() {
  return (
    <div className="site-width py-8 sm:py-10">
      <h1 className="page-title">Contact</h1>
      <p className="mt-3 text-slate-700">Une question sur une référence, une livraison ou un appareil ?</p>
      <div className="mt-6 grid items-start gap-5 lg:grid-cols-[1fr_2fr] lg:gap-8">
        <section aria-label="Coordonnées" className="grid gap-4 rounded-lg border border-line bg-paper p-5 text-sm">
          <a href="mailto:contact@expert-diagnostic.dz" className="flex items-center gap-3 break-all font-medium text-brand hover:underline">
            <Mail size={18} className="shrink-0" aria-hidden="true" /> contact@expert-diagnostic.dz
          </a>
          <a href="tel:+21323456789" className="flex items-center gap-3 font-medium text-brand hover:underline">
            <Phone size={18} className="shrink-0" aria-hidden="true" /> +213 (0) 23 45 67 89
          </a>
          <p className="text-slate-700">Pour le SAV, indiquez le modèle de l’appareil et son numéro de série.</p>
        </section>
        <Suspense fallback={<p className="text-sm text-slate-600">Chargement du formulaire…</p>}>
          <ContactQuery />
        </Suspense>
      </div>
    </div>
  );
}
