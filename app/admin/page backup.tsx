'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Shield,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wrench,
  Plus,
  Search,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Mail,
  ArrowUpRight,
  Upload,
  X,
  Clock,
  LogOut,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  Constants & shared styles                                                 */
/* -------------------------------------------------------------------------- */

type AppState = ReturnType<typeof useApp>;
type Product = AppState['products'][number];
type ProductType = 'equipment' | 'reagent' | 'consumable';

/* Customer that off-site purchases are attached to (same value as before). */
const OFFLINE_CUSTOMER_ID = 'cust-1';

const CONTAINER = 'max-w-[1760px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-20';
const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2';

/* Every input, select and textarea is text-black */
const INPUT =
  'w-full text-sm text-black placeholder:text-slate-400 border border-slate-300 rounded-xl px-3.5 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-slate-100 disabled:text-slate-500';

const BTN_PRIMARY = `px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/25 transition inline-flex items-center justify-center gap-2 ${FOCUS}`;
const BTN_SUCCESS = `px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/25 transition inline-flex items-center justify-center gap-2 ${FOCUS}`;
const BTN_GHOST = `px-5 py-2.5 bg-white border border-slate-200 text-slate-800 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition rounded-xl inline-flex items-center justify-center gap-2 ${FOCUS}`;

const TYPE_LABELS: Record<string, string> = {
  equipment: 'Équipement / Analyseur',
  reagent: 'Réactif',
  consumable: 'Consommable',
};

/* Values are the ones your context already uses; labels are display only. */
const ORDER_STATUSES = [
  { value: 'New', label: 'Nouvelle' },
  { value: 'Contacted', label: 'Client contacté' },
  { value: 'Confirmed', label: 'Confirmée' },
  { value: 'Delivered', label: 'Livrée' },
  { value: 'Cancelled', label: 'Annulée' },
];

const PROBLEM_STATUSES = [
  { value: 'New', label: 'Nouveau' },
  { value: 'In progress', label: 'En cours' },
  { value: 'Intervention scheduled', label: 'Intervention planifiée' },
  { value: 'Resolved', label: 'Résolu' },
  { value: 'Closed', label: 'Clôturé' },
];

const TABS = [
  { id: 'stats', label: 'Synthèse', icon: LayoutDashboard },
  { id: 'catalog', label: 'Catalogue & Stocks', icon: Package },
  { id: 'orders', label: 'Demandes & Commandes', icon: ShoppingCart },
  { id: 'sav', label: 'Rapports SAV', icon: Wrench },
] as const;

type TabId = (typeof TABS)[number]['id'];

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=900';

function statusTone(status: string) {
  switch (status) {
    case 'Delivered':
    case 'Resolved':
    case 'Closed':
      return 'bg-emerald-100 text-emerald-800';
    case 'Confirmed':
    case 'In progress':
      return 'bg-blue-100 text-blue-800';
    case 'Cancelled':
      return 'bg-rose-100 text-rose-800';
    case 'Intervention scheduled':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-amber-100 text-amber-800';
  }
}

function labelOf(list: { value: string; label: string }[], value: string) {
  return list.find((s) => s.value === value)?.label ?? value;
}

/* -------------------------------------------------------------------------- */
/*  Small building blocks                                                     */
/* -------------------------------------------------------------------------- */

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="w-8 h-[2px] bg-blue-600" />
          <span className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em]">{eyebrow}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function Empty({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-14 text-center text-sm text-slate-500">
      {message}
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  tone = 'blue',
}: {
  label: string;
  value: number | string;
  hint?: string;
  tone?: 'blue' | 'amber' | 'rose' | 'emerald' | 'slate';
}) {
  const tones = {
    blue: 'text-blue-600',
    amber: 'text-amber-600',
    rose: 'text-rose-600',
    emerald: 'text-emerald-600',
    slate: 'text-slate-900',
  };
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className={`text-4xl font-black mt-2 ${tones[tone]}`}>{value}</p>
      {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
    </div>
  );
}

function Modal({
  title,
  eyebrow,
  onClose,
  maxWidth = 'max-w-4xl',
  children,
}: {
  title: string;
  eyebrow: string;
  onClose: () => void;
  maxWidth?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-3xl shadow-2xl w-full ${maxWidth} my-8 flex flex-col`}>
        <div className="flex items-start justify-between gap-4 p-6 sm:p-8 border-b border-slate-200">
          <div>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em]">{eyebrow}</p>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">{title}</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Fermer" className={`p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition ${FOCUS}`}>
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Add product form                                                          */
/* -------------------------------------------------------------------------- */

interface FormState {
  name: string;
  reference: string;
  type: ProductType;
  brand: string;
  domain: string;
  description: string;
  image: string;
  priceEstimate: string;
  status: 'available' | 'unavailable';
  expectedReturnDate: string;
  note: string;
  features: string[];
  visible: boolean;
}

function AddProductModal({
  products,
  domains,
  brands,
  onSave,
  onClose,
}: {
  products: Product[];
  domains: AppState['domains'];
  brands: AppState['brands'];
  onSave: (payload: Record<string, unknown>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormState>({
    name: '',
    reference: '',
    type: 'reagent',
    brand: brands[0]?.name || '',
    domain: domains[0]?.name || '',
    description: '',
    image: DEFAULT_IMAGE,
    priceEstimate: '',
    status: 'available',
    expectedReturnDate: '',
    note: '',
    features: ['Qualité certifiée'],
    visible: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleFile = (file?: File) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setErrors((e) => ({ ...e, image: 'Image trop lourde (2 Mo maximum).' }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      set('image', String(reader.result));
      setErrors((e) => ({ ...e, image: '' }));
    };
    reader.readAsDataURL(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    const ref = form.reference.trim().toLowerCase();

    if (!form.name.trim()) next.name = 'Le nom est obligatoire.';
    if (!ref) next.reference = 'La référence est obligatoire.';
    else if (products.some((p) => p.reference.toLowerCase() === ref)) next.reference = 'Cette référence existe déjà.';
    if (!form.brand) next.brand = 'Choisissez une marque.';
    if (!form.domain) next.domain = 'Choisissez un domaine.';
    if (form.description.trim().length < 10) next.description = 'Description trop courte (10 caractères minimum).';
    if (!form.image.trim()) next.image = 'Ajoutez une image (URL ou fichier).';

    setErrors(next);
    if (Object.keys(next).length) return;

    const unavailable = form.status === 'unavailable';
    onSave({
      name: form.name.trim(),
      reference: form.reference.trim(),
      type: form.type,
      brand: form.brand,
      domain: form.domain,
      description: form.description.trim(),
      features: form.features.map((f) => f.trim()).filter(Boolean),
      image: form.image.trim(),
      status: form.status,
      visible: form.visible,
      priceEstimate: form.priceEstimate.trim() || 'Sur devis',
      ...(unavailable && form.expectedReturnDate ? { expectedReturnDate: form.expectedReturnDate } : {}),
      ...(unavailable && form.note.trim() ? { note: form.note.trim() } : {}),
    });
  };

  return (
    <Modal eyebrow="Nouveau produit" title="Ajouter un produit au catalogue" onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <div className="p-6 sm:p-8 space-y-8">
          <fieldset className="space-y-5">
            <legend className="text-xs font-bold text-slate-900 uppercase tracking-[0.2em] mb-4">Identification</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Nom du produit" required error={errors.name}>
                <input className={INPUT} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Ex : Analyseur de biochimie BS-240" />
              </Field>
              <Field label="Référence" required error={errors.reference} hint="Identifiant unique (code fabricant).">
                <input className={`${INPUT} font-mono`} value={form.reference} onChange={(e) => set('reference', e.target.value)} placeholder="Ex : REF-001" />
              </Field>
              <Field label="Marque / Fabricant" required error={errors.brand}>
                <select className={INPUT} value={form.brand} onChange={(e) => set('brand', e.target.value)}>
                  <option value="">-- Choisir une marque --</option>
                  {brands.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
                </select>
              </Field>
              <Field label="Domaine / Spécialité" required error={errors.domain}>
                <select className={INPUT} value={form.domain} onChange={(e) => set('domain', e.target.value)}>
                  <option value="">-- Choisir un domaine --</option>
                  {domains.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </Field>
              <Field label="Type de produit" required>
                <select className={INPUT} value={form.type} onChange={(e) => set('type', e.target.value as ProductType)}>
                  <option value="equipment">Équipement / Analyseur</option>
                  <option value="reagent">Réactif</option>
                  <option value="consumable">Consommable</option>
                </select>
              </Field>
              <Field label="Tarif indicatif" hint="Laissez vide pour afficher « Sur devis ».">
                <input className={INPUT} value={form.priceEstimate} onChange={(e) => set('priceEstimate', e.target.value)} placeholder="Ex : À partir de 450 000 DA" />
              </Field>
            </div>
            <Field label="Description" required error={errors.description}>
              <textarea className={`${INPUT} resize-none`} rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Présentez le produit, ses usages et ses points forts..." />
            </Field>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="text-xs font-bold text-slate-900 uppercase tracking-[0.2em] mb-4">Image du produit</legend>
            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5 items-start">
              <div className="h-40 rounded-2xl border border-slate-200 bg-slate-100 overflow-hidden flex items-center justify-center text-xs text-slate-400">
                {form.image ? <img src={form.image} alt="Aperçu" className="w-full h-full object-cover" /> : 'Aperçu'}
              </div>
              <div className="space-y-4">
                <Field label="URL de l’image" required error={errors.image}>
                  <input
                    className={INPUT}
                    value={form.image.startsWith('data:') ? '' : form.image}
                    onChange={(e) => set('image', e.target.value)}
                    placeholder={form.image.startsWith('data:') ? 'Fichier importé' : 'https://...'}
                  />
                </Field>
                <label className={`${BTN_GHOST} cursor-pointer`}>
                  <Upload className="w-4 h-4" />
                  <span>Importer un fichier</span>
                  <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleFile(e.target.files?.[0])} />
                </label>
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="text-xs font-bold text-slate-900 uppercase tracking-[0.2em] mb-4">Caractéristiques techniques</legend>
            <div className="space-y-3">
              {form.features.map((feat, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    className={INPUT}
                    value={feat}
                    onChange={(e) => set('features', form.features.map((f, i) => (i === idx ? e.target.value : f)))}
                    placeholder="Ex : Débit de 240 tests/heure"
                  />
                  <button
                    type="button"
                    onClick={() => set('features', form.features.length > 1 ? form.features.filter((_, i) => i !== idx) : [''])}
                    aria-label="Supprimer la caractéristique"
                    className={`px-3 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition ${FOCUS}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => set('features', [...form.features, ''])} className={`text-sm font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1.5 transition rounded-lg ${FOCUS}`}>
                <Plus className="w-4 h-4" />
                Ajouter une caractéristique
              </button>
            </div>
          </fieldset>

          <fieldset className="space-y-5">
            <legend className="text-xs font-bold text-slate-900 uppercase tracking-[0.2em] mb-4">Disponibilité & publication</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Statut">
                <select className={INPUT} value={form.status} onChange={(e) => set('status', e.target.value as FormState['status'])}>
                  <option value="available">Disponible</option>
                  <option value="unavailable">Temporairement indisponible</option>
                </select>
              </Field>
              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer pb-2.5">
                  <input type="checkbox" checked={form.visible} onChange={(e) => set('visible', e.target.checked)} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                  <span className="text-sm font-medium text-slate-700">Visible sur le site public</span>
                </label>
              </div>
            </div>

            {form.status === 'unavailable' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 rounded-2xl bg-amber-50 border border-amber-200">
                <Field label="Date de retour estimée">
                  <input type="date" className={INPUT} value={form.expectedReturnDate} onChange={(e) => set('expectedReturnDate', e.target.value)} />
                </Field>
                <Field label="Note pour les clients">
                  <input className={INPUT} value={form.note} onChange={(e) => set('note', e.target.value)} placeholder="Ex : Réapprovisionnement en cours" />
                </Field>
              </div>
            )}
          </fieldset>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 p-6 sm:p-8 border-t border-slate-200 bg-slate-50/70 rounded-b-3xl">
          <button type="button" onClick={onClose} className={BTN_GHOST}>Annuler</button>
          <button type="submit" className={BTN_PRIMARY}>
            <CheckCircle2 className="w-4 h-4" />
            Créer le produit
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* -------------------------------------------------------------------------- */
/*  Offline purchase modal                                                    */
/* -------------------------------------------------------------------------- */

function OfflinePurchaseModal({
  products,
  onSave,
  onClose,
}: {
  products: Product[];
  onSave: (productId: string, qty: number, serial: string) => void;
  onClose: () => void;
}) {
  const [productId, setProductId] = useState(products[0]?.id || '');
  const [qty, setQty] = useState(1);
  const [serial, setSerial] = useState('');
  const selected = products.find((p) => p.id === productId);

  return (
    <Modal eyebrow="Vente directe" title="Enregistrer un achat hors-site" onClose={onClose} maxWidth="max-w-xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (productId) onSave(productId, qty, serial.trim());
        }}
      >
        <div className="p-6 sm:p-8 space-y-5">
          <p className="text-sm text-slate-500 leading-relaxed">
            Ajoute un achat effectué hors du site dans l’historique du client.
          </p>
          <Field label="Produit" required>
            <select className={INPUT} value={productId} onChange={(e) => setProductId(e.target.value)}>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.reference})</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Quantité" required>
              <input type="number" min={1} className={INPUT} value={qty} onChange={(e) => setQty(parseInt(e.target.value) || 1)} />
            </Field>
            <Field label="N° de série" hint={selected?.type === 'equipment' ? 'Recommandé pour un équipement.' : 'Si équipement uniquement.'}>
              <input className={`${INPUT} font-mono`} value={serial} onChange={(e) => setSerial(e.target.value)} placeholder="SN-..." />
            </Field>
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 p-6 sm:p-8 border-t border-slate-200 bg-slate-50/70 rounded-b-3xl">
          <button type="button" onClick={onClose} className={BTN_GHOST}>Annuler</button>
          <button type="submit" className={BTN_SUCCESS}>
            <CheckCircle2 className="w-4 h-4" />
            Enregistrer l’achat
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* -------------------------------------------------------------------------- */
/*  SAV card                                                                  */
/* -------------------------------------------------------------------------- */

function ProblemCard({
  prob,
  onSave,
}: {
  prob: AppState['problems'][number];
  onSave: (status: any, date: string, msg: string, note: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<string>(prob.status);
  const [date, setDate] = useState(prob.plannedInterventionDate || '');
  const [msg, setMsg] = useState(prob.messageToCustomer || '');
  const [note, setNote] = useState(prob.internalNote || '');

  const statuses = PROBLEM_STATUSES.some((s) => s.value === prob.status)
    ? PROBLEM_STATUSES
    : [...PROBLEM_STATUSES, { value: prob.status, label: prob.status }];

  const open = () => {
    setStatus(prob.status);
    setDate(prob.plannedInterventionDate || '');
    setMsg(prob.messageToCustomer || '');
    setNote(prob.internalNote || '');
    setEditing(true);
  };

  return (
    <article className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono font-bold text-blue-600 text-base">{prob.reference}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusTone(prob.status)}`}>{labelOf(PROBLEM_STATUSES, prob.status)}</span>
          {prob.urgency === 'urgent' && <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full">Urgent</span>}
          <span className="text-sm font-bold text-slate-900">{prob.laboratoryName}</span>
        </div>
        {!editing && <button onClick={open} className={BTN_PRIMARY}>Traiter / Mettre à jour</button>}
      </div>

      <div>
        <p className="text-sm font-bold text-slate-900">
          {prob.equipmentName}
          {prob.serialNumber && <span className="font-mono text-slate-500 font-medium"> · S/N {prob.serialNumber}</span>}
        </p>
        <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl mt-3 leading-relaxed">{prob.description}</p>
      </div>

      {editing ? (
        <div className="p-6 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Statut">
              <select className={INPUT} value={status} onChange={(e) => setStatus(e.target.value)}>
                {statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </Field>
            <Field label="Intervention planifiée">
              <input className={INPUT} value={date} onChange={(e) => setDate(e.target.value)} placeholder="Ex : 2026-11-15 10:00" />
            </Field>
          </div>
          <Field label="Message visible par le client">
            <textarea className={`${INPUT} resize-none`} rows={2} value={msg} onChange={(e) => setMsg(e.target.value)} />
          </Field>
          <Field label="Note interne" hint="Visible par l’administration uniquement.">
            <input className={INPUT} value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
          <div className="flex gap-3">
            <button
              onClick={() => {
                onSave(status, date, msg, note);
                setEditing(false);
              }}
              className={BTN_SUCCESS}
            >
              Enregistrer
            </button>
            <button onClick={() => setEditing(false)} className={BTN_GHOST}>Annuler</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-purple-50 text-purple-900 rounded-2xl">
            <strong className="block text-[11px] uppercase tracking-wider opacity-70 mb-1">Intervention</strong>
            {prob.plannedInterventionDate || 'Non planifiée'}
          </div>
          <div className="p-4 bg-blue-50 text-blue-900 rounded-2xl">
            <strong className="block text-[11px] uppercase tracking-wider opacity-70 mb-1">Message client</strong>
            {prob.messageToCustomer || 'Aucun message'}
          </div>
          <div className="p-4 bg-slate-100 text-slate-800 rounded-2xl">
            <strong className="block text-[11px] uppercase tracking-wider opacity-70 mb-1">Note interne</strong>
            {prob.internalNote || '—'}
          </div>
        </div>
      )}
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function AdminBackOfficePage() {
  const {
    role,
    setRole,
    products,
    domains,
    brands,
    orders,
    problems,
    addProduct,
    deleteProduct,
    toggleProductAvailability,
    updateOrderStatus,
    updateProblemStatus,
    recordOfflinePurchase,
  } = useApp();

  const [adminEmail, setAdminEmail] = useState('admin@expert-diagnostic.dz');
  const [adminPassword, setAdminPassword] = useState('••••••••');
  const [loginError, setLoginError] = useState(false);

  const [tab, setTab] = useState<TabId>('stats');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Catalogue filters
  const [query, setQuery] = useState('');
  const [fDomain, setFDomain] = useState('all');
  const [fType, setFType] = useState('all');
  const [fStatus, setFStatus] = useState('all');
  // Orders filter
  const [oFilter, setOFilter] = useState('all');

  const notify = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (fDomain !== 'all' && p.domain !== fDomain) return false;
      if (fType !== 'all' && p.type !== fType) return false;
      if (fStatus !== 'all' && p.status !== fStatus) return false;
      if (q && !`${p.name} ${p.brand} ${p.reference}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, query, fDomain, fType, fStatus]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail && adminPassword) {
      setRole('admin');
    } else {
      setLoginError(true);
    }
  };

  /* ------------------------------ Login screen ------------------------------ */
  if (role !== 'admin') {
    return (
      <div className="bg-slate-50/70 min-h-[calc(100svh-6rem)] flex items-center">
        <div className="w-full max-w-xl mx-auto px-6 py-20">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-8">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
                <Shield className="w-7 h-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Espace Administration</h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                Connexion sécurisée réservée au personnel autorisé d’Expert Diagnostic.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <Field label="Adresse e-mail admin">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input type="email" required value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className={`${INPUT} pl-10`} />
                </div>
              </Field>

              <Field label="Mot de passe">
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input type="password" required value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className={`${INPUT} pl-10`} />
                </div>
              </Field>

              {loginError && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl font-medium">
                  Identifiants incorrects. Veuillez réessayer.
                </div>
              )}

              <button type="submit" className={`${BTN_PRIMARY} w-full py-4`}>
                <span>Se connecter au Back-Office</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-1">
                <button type="button" onClick={() => setRole('admin')} className={`text-xs font-bold text-blue-600 hover:text-blue-700 transition rounded ${FOCUS}`}>
                  Accès rapide démo (connexion directe Admin) →
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------- Dashboard ------------------------------- */
  const activeProblems = problems.filter((p) => p.status !== 'Resolved' && p.status !== 'Closed');
  const urgentProblems = activeProblems.filter((p) => p.urgency === 'urgent');
  const newOrders = orders.filter((o) => o.status === 'New' || o.status === 'Contacted');
  const availableCount = products.filter((p) => p.status === 'available').length;
  const shownOrders = orders.filter((o) => oFilter === 'all' || o.status === oFilter);

  const badges: Partial<Record<TabId, number>> = { orders: newOrders.length, sav: activeProblems.length };

  const createProduct = (payload: Record<string, unknown>) => {
    addProduct(payload as any);
    setShowAddModal(false);
    notify(`« ${String(payload.name)} » a été ajouté au catalogue.`);
  };

  const removeProduct = (p: Product) => {
    if (window.confirm(`Supprimer définitivement « ${p.name} » ?`)) {
      deleteProduct(p.id);
      notify(`« ${p.name} » a été supprimé.`);
    }
  };

  return (
    <div className="bg-slate-50/70 min-h-[calc(100svh-6rem)]">
      <div className={`${CONTAINER} py-10 lg:py-12 space-y-10`}>
        {/* Admin banner */}
        <div className="bg-slate-900 text-white p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden flex flex-col lg:flex-row justify-between lg:items-center gap-8">
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
          <div className="relative space-y-3">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3.5 py-1 rounded-full text-xs font-bold border border-emerald-500/30">
              <Shield className="w-3.5 h-3.5" />
              <span>Session admin active ({adminEmail})</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Tableau de bord <span className="text-blue-400">Back-Office</span>
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Gestion centralisée du catalogue, des commandes clients et du service après-vente (SAV).
            </p>
          </div>
          <div className="relative flex flex-wrap items-center gap-3">
            <button onClick={() => setShowAddModal(true)} className={BTN_PRIMARY}>
              <Plus className="w-4 h-4" />
              Nouveau produit
            </button>
            <button onClick={() => setShowOfflineModal(true)} className={BTN_SUCCESS}>
              <ShoppingCart className="w-4 h-4" />
              Achat hors-site
            </button>
            <button
              onClick={() => setRole('visitor')}
              className={`px-5 py-2.5 border border-slate-700 text-slate-200 hover:bg-slate-800 font-bold text-sm rounded-xl transition inline-flex items-center gap-2 ${FOCUS}`}
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>

        {toast && (
          <div role="status" className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-sm text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{toast}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 lg:gap-12 items-start">
          {/* Navigation */}
          <nav aria-label="Sections du back-office" className="bg-white border border-slate-200 rounded-3xl p-3 shadow-sm flex lg:flex-col gap-1 overflow-x-auto lg:sticky lg:top-32">
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = tab === id;
              const badge = badges[id];
              return (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap transition ${FOCUS} ${
                    active ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="flex-1 text-left">{label}</span>
                  {badge ? (
                    <span className={`min-w-5 h-5 px-1.5 rounded-full text-[11px] font-bold flex items-center justify-center ${active ? 'bg-white/25 text-white' : 'bg-blue-100 text-blue-700'}`}>
                      {badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          <main className="min-w-0">
            {/* ------------------------------ Stats ------------------------------ */}
            {tab === 'stats' && (
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
                      <button onClick={() => setTab('orders')} className={`text-sm font-bold text-blue-600 hover:text-blue-800 rounded-lg ${FOCUS}`}>Tout voir</button>
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
                      <button onClick={() => setTab('sav')} className={`text-sm font-bold text-blue-600 hover:text-blue-800 rounded-lg ${FOCUS}`}>Tout voir</button>
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
            )}

            {/* ----------------------------- Catalogue ---------------------------- */}
            {tab === 'catalog' && (
              <div className="space-y-8">
                <SectionTitle
                  eyebrow="Catalogue"
                  title="Produits & disponibilité"
                  action={
                    <button onClick={() => setShowAddModal(true)} className={BTN_PRIMARY}>
                      <Plus className="w-4 h-4" />
                      Ajouter un produit
                    </button>
                  }
                />

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input className={`${INPUT} pl-10`} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nom, marque, référence..." />
                  </div>
                  <select className={INPUT} value={fDomain} onChange={(e) => setFDomain(e.target.value)}>
                    <option value="all">Tous les domaines</option>
                    {domains.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                  <select className={INPUT} value={fType} onChange={(e) => setFType(e.target.value)}>
                    <option value="all">Tous les types</option>
                    <option value="equipment">Équipement / Analyseur</option>
                    <option value="reagent">Réactif</option>
                    <option value="consumable">Consommable</option>
                  </select>
                  <select className={INPUT} value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
                    <option value="all">Tous les statuts</option>
                    <option value="available">Disponible</option>
                    <option value="unavailable">Indisponible</option>
                  </select>
                </div>

                {filteredProducts.length === 0 ? (
                  <Empty message="Aucun produit ne correspond à votre recherche." />
                ) : (
                  <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          <tr>
                            <th className="px-5 py-4">Produit</th>
                            <th className="px-5 py-4">Domaine</th>
                            <th className="px-5 py-4">Type</th>
                            <th className="px-5 py-4">Tarif</th>
                            <th className="px-5 py-4">Disponibilité</th>
                            <th className="px-5 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredProducts.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50/70 transition">
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-4 min-w-[260px]">
                                  <img src={p.image} alt={p.name} className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0" />
                                  <div className="min-w-0">
                                    <p className="font-bold text-slate-900 line-clamp-1">{p.name}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                      <span className="font-mono font-bold text-blue-600">{p.reference}</span> · {p.brand}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-slate-700">{p.domain}</td>
                              <td className="px-5 py-4 text-slate-700">{TYPE_LABELS[p.type] ?? p.type}</td>
                              <td className="px-5 py-4 font-semibold text-slate-900">{p.priceEstimate || 'Sur devis'}</td>
                              <td className="px-5 py-4">
                                <button
                                  onClick={() => toggleProductAvailability(p.id)}
                                  title="Cliquer pour changer la disponibilité"
                                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 w-fit ${FOCUS} ${
                                    p.status === 'available' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                                  }`}
                                >
                                  {p.status === 'available' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                                  <span>{p.status === 'available' ? 'Disponible' : 'Indisponible'}</span>
                                </button>
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex items-center justify-end gap-1">
                                  <Link href={`/catalogue/${p.id}`} aria-label="Voir la fiche publique" className={`p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition ${FOCUS}`}>
                                    <ArrowUpRight className="w-4 h-4" />
                                  </Link>
                                  <button onClick={() => removeProduct(p)} aria-label="Supprimer" title="Supprimer" className={`p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition ${FOCUS}`}>
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------ Orders ------------------------------ */}
            {tab === 'orders' && (
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
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
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
            )}

            {/* -------------------------------- SAV ------------------------------- */}
            {tab === 'sav' && (
              <div className="space-y-8">
                <SectionTitle eyebrow="Service après-vente" title="Rapports SAV & problèmes" />
                {problems.length === 0 ? (
                  <Empty message="Aucun rapport SAV pour le moment." />
                ) : (
                  <div className="space-y-5">
                    {problems.map((prob) => (
                      <ProblemCard
                        key={prob.id}
                        prob={prob}
                        onSave={(status, date, msg, note) => {
                          updateProblemStatus(prob.id, status, date, msg, note);
                          notify(`Dossier ${prob.reference} mis à jour.`);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {showAddModal && (
        <AddProductModal
          products={products}
          domains={domains}
          brands={brands}
          onSave={createProduct}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {showOfflineModal && (
        <OfflinePurchaseModal
          products={products}
          onClose={() => setShowOfflineModal(false)}
          onSave={(productId, qty, serial) => {
            recordOfflinePurchase(OFFLINE_CUSTOMER_ID, productId, qty, serial);
            setShowOfflineModal(false);
            notify('Achat hors-site enregistré et rattaché à l’historique client.');
          }}
        />
      )}
    </div>
  );
}