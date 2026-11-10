'use client';

import React, { useState } from 'react';
import { Plus, CheckCircle2, Upload, X } from 'lucide-react';
import { Domain, Brand } from '@/types';
import {
  AppState,
  Product,
  ProductType,
  DEFAULT_IMAGE,
  INPUT,
  BTN_PRIMARY,
  BTN_GHOST,
  FOCUS,
} from '../constants';
import { Field, Modal } from './AdminUI';

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

export function AddProductModal({
  product,
  products,
  domains,
  brands,
  onSave,
  onClose,
}: {
  product?: Product;
  products: Product[];
  domains?: Domain[];
  brands?: Brand[];
  onSave: (payload: Record<string, unknown>) => void;
  onClose: () => void;
}) {
  const isEditing = !!product;
  const [form, setForm] = useState<FormState>({
    name: product?.name || '',
    reference: product?.reference || '',
    type: product?.type || 'reagent',
    brand: product?.brand || '',
    domain: product?.domain || '',
    description: product?.description || '',
    image: product?.image || DEFAULT_IMAGE,
    priceEstimate: product?.priceEstimate || '',
    status: product?.status || 'available',
    expectedReturnDate: product?.expectedReturnDate || '',
    note: product?.note || '',
    features: product?.features?.length ? product.features : ['Qualité certifiée'],
    visible: product?.visible ?? true,
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
    else if (products.some((p) => p.reference.toLowerCase() === ref && (!isEditing || p.id !== product.id))) {
      next.reference = 'Cette référence existe déjà.';
    }
    if (!form.brand) next.brand = 'Choisissez une marque.';
    if (!form.domain) next.domain = 'Choisissez un domaine.';
    if (form.description.trim().length < 10) next.description = 'Description trop courte (10 caractères minimum).';
    if (!form.image.trim()) next.image = 'Ajoutez une image (URL ou fichier).';

    setErrors(next);
    if (Object.keys(next).length) return;

    const unavailable = form.status === 'unavailable';
    onSave({
      ...(isEditing ? { id: product.id } : {}),
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

  const BRANDS = brands && brands.length > 0 ? brands.map(b => b.name) : ['Sysmex', 'Roche', 'Abbott', 'Siemens', 'Mindray', 'Medconn'];
  const DOMAINS = domains && domains.length > 0 ? domains.map(d => d.name) : ['Hématologie', 'Biochimie', 'Immunologie', 'Microbiologie', 'Urinalyse'];

  return (
    <Modal eyebrow={isEditing ? 'Modification' : 'Nouveau produit'} title={isEditing ? 'Modifier le produit' : 'Ajouter un produit au catalogue'} onClose={onClose}>
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
                  {BRANDS.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </Field>
              <Field label="Domaine / Spécialité" required error={errors.domain}>
                <select className={INPUT} value={form.domain} onChange={(e) => set('domain', e.target.value)}>
                  <option value="">-- Choisir un domaine --</option>
                  {DOMAINS.map((domain) => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
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
            {isEditing ? 'Enregistrer les modifications' : 'Créer le produit'}
          </button>
        </div>
      </form>
    </Modal>
  );
}