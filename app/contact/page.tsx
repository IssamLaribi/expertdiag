'use client';

import { Suspense, useRef, useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Mail, Phone, Wrench } from 'lucide-react';
import { Molecule } from '@/components/Molecule';
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
      <div role="status" className="card flex flex-col items-center px-6 py-14 text-center">
        <div className="grid size-16 place-items-center rounded-full bg-ok/10 text-ok"><CheckCircle2 size={34} strokeWidth={1.75} aria-hidden="true" /></div>
        <h2 className="headline mt-5 text-2xl">Message envoyé</h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-mute">Notre équipe vous répondra aux coordonnées indiquées. Rappelez ce numéro si vous nous téléphonez.</p>
        <div className="mt-6 rounded-xl border border-dashed border-line-strong bg-paper px-6 py-3">
          <p className="text-xs text-mute">Numéro de message</p>
          <p className="mt-0.5 text-xl font-bold tracking-wide tabular-nums">{receipt.reference}</p>
        </div>
        <button type="button" className="button-secondary mt-8" onClick={() => {
          setDraft((previous) => ({ ...previous, subject: 'other', message: '' }));
          setReceipt(undefined);
        }}>Écrire un autre message</button>
      </div>
    );
  }

  return (
    <form onSubmit={send} className="card space-y-5 p-6 sm:p-8">
      <div>
        <h2 className="headline text-2xl">Écrire un message</h2>
        <p className="mt-1 text-sm text-mute">Tous les champs sont obligatoires.</p>
      </div>
      <fieldset disabled={sending} className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
        {CONTACT_FIELDS.map(({ field, label, type, autoComplete, minLength, maxLength }) => (
          <label key={field} className="field-label">
            {label}
            <input
              required name={field} type={type} autoComplete={autoComplete} minLength={minLength} maxLength={maxLength}
              value={draft[field]} className="field-input"
              onChange={(event) => setDraft((previous) => ({ ...previous, [field]: event.target.value }))}
            />
          </label>
        ))}
        <label className="field-label sm:col-span-2">
          Sujet
          <select className="field-input" name="subject" value={draft.subject}
            onChange={(event) => setDraft((previous) => ({ ...previous, subject: event.target.value as Subject }))}>
            {Object.entries(SUBJECTS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        {hasProduct && (
          <p className="flex flex-wrap items-baseline gap-x-3 rounded-xl bg-paper px-4 py-3 text-sm sm:col-span-2">
            {product && <span className="font-medium">{product}</span>}
            {reference && <span className="ref text-mute">{reference}</span>}
          </p>
        )}
        <label className="field-label sm:col-span-2">
          Votre message
          <textarea required name="message" rows={5} minLength={10} maxLength={3000} value={draft.message} className="field-input"
            onChange={(event) => setDraft((previous) => ({ ...previous, message: event.target.value }))} />
        </label>
      </fieldset>
      {error && <p role="alert" className="rounded-lg bg-signal/8 px-3 py-2 text-sm text-signal">{error}</p>}
      <button type="submit" className="button-primary min-h-12 px-5" disabled={sending}>{sending ? 'Envoi en cours…' : 'Envoyer le message'}</button>
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
    <>
      <div className="border-b border-line bg-paper">
        <div className="site-width py-10 sm:py-14">
          <h1 className="page-title">Contact</h1>
          <p className="mt-3 max-w-xl text-lg text-mute">Une question sur une référence, une livraison ou un appareil&nbsp;? Appelez-nous ou laissez un message.</p>
        </div>
      </div>
      <div className="site-width grid grid-cols-[minmax(0,1fr)] items-start gap-6 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-8">
        <section aria-label="Coordonnées" className="relative overflow-hidden rounded-2xl bg-night p-6 text-white sm:p-8">
          <Molecule className="pointer-events-none absolute -right-28 -bottom-28 w-80 text-white/[0.07]" />
          <div className="relative space-y-7">
            <div>
              <h2 className="text-sm text-white/60">Par téléphone</h2>
              <a href="tel:+21323456789" className="headline mt-1 inline-flex items-center gap-3 text-[2rem] leading-tight hover:underline">
                <Phone size={24} strokeWidth={1.75} aria-hidden="true" /> 023 45 67 89
              </a>
              <p className="mt-1 text-sm text-white/55">+213 (0) 23 45 67 89</p>
            </div>
            <div>
              <h2 className="text-sm text-white/60">Par e-mail</h2>
              <a href="mailto:contact@expert-diagnostic.dz" className="mt-1 inline-flex items-center gap-2.5 break-all font-semibold hover:underline">
                <Mail size={18} className="shrink-0" aria-hidden="true" /> contact@expert-diagnostic.dz
              </a>
            </div>
            <div className="rounded-xl bg-white/[0.07] p-4 text-sm ring-1 ring-white/10">
              <h2 className="flex items-center gap-2 font-semibold"><Wrench size={16} aria-hidden="true" /> Service après-vente</h2>
              <p className="mt-1.5 leading-relaxed text-white/70">Indiquez le modèle de l’appareil, son numéro de série et ce que vous observez, ou le code d’erreur affiché.</p>
            </div>
          </div>
        </section>
        <Suspense fallback={<p className="text-sm text-mute">Chargement du formulaire…</p>}>
          <ContactQuery />
        </Suspense>
      </div>
    </>
  );
}
