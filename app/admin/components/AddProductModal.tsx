'use client';

import React, { useRef, useState } from 'react';
import { Plus, Upload, X } from 'lucide-react';
import type { Domain, Brand } from '@/types';
import { ProductImage } from '@/components/ProductImage';
import {
  Product,
  ProductType,
  DEFAULT_IMAGE,
  INPUT,
  BTN_PRIMARY,
  BTN_GHOST,
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
  onSave: (payload: Omit<Product, 'id'>) => Promise<void>;
  onClose: () => void;
}) {
  const isEditing = !!product;
  const previousReturnDate = product?.expectedReturnDate ?? '';
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
    expectedReturnDate: /^\d{4}-\d{2}-\d{2}$/.test(previousReturnDate) ? previousReturnDate : '',
    note: product?.note || '',
    features: product?.features?.length ? product.features : ['Qualité certifiée'],
    visible: product?.visible ?? true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const inFlight = useRef(false);

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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inFlight.current) return;
    setSaveError('');
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
    inFlight.current = true;
    setSaving(true);
    try {
      await onSave({
        name: form.name.trim(),
        reference: ref,
        type: form.type,
        brand: form.brand,
        domain: form.domain,
        description: form.description.trim(),
        features: form.features.map((feature) => feature.trim()).filter(Boolean),
        image: form.image.trim(),
        status: form.status,
        visible: form.visible,
        priceEstimate: form.priceEstimate.trim() || 'Sur devis',
        expectedReturnDate: unavailable && form.expectedReturnDate ? form.expectedReturnDate : undefined,
        note: unavailable && form.note.trim() ? form.note.trim() : undefined,
      });
    } catch (failure) {
      setSaveError(failure instanceof Error ? failure.message : 'Le produit n’a pas été enregistré.');
    } finally {
      inFlight.current = false;
      setSaving(false);
    }
  };

  const BRANDS = [...new Set([
    'Sysmex', 'Roche', 'Abbott', 'Siemens', 'Mindray', 'Medconn',
    ...(brands ?? []).map(({ name }) => name), ...(product?.brand ? [product.brand] : []),
  ])].sort((a, b) => a.localeCompare(b, 'fr'));
  const DOMAINS = [...new Set([
    'Hématologie', 'Biochimie', 'Immunologie', 'Microbiologie', 'Urinalyse',
    ...(domains ?? []).map(({ name }) => name), ...(product?.domain ? [product.domain] : []),
  ])].sort((a, b) => a.localeCompare(b, 'fr'));

  return (
    <Modal title={isEditing ? 'Modifier le produit' : 'Ajouter un produit au catalogue'} onClose={() => { if (!saving) onClose(); }}>
      <form onSubmit={submit} noValidate>
        <fieldset disabled={saving} className="space-y-9 p-5 sm:p-8">
          <fieldset className="space-y-5">
            <legend className="mb-4 w-full border-b border-line pb-2 text-base font-semibold">Identification</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Nom du produit" required error={errors.name}>
                <input className={INPUT} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Ex : Analyseur de biochimie BS-240" />
              </Field>
              <Field label="Référence" required error={errors.reference} hint="Identifiant unique (code fabricant).">
                <input className={`${INPUT} font-mono`} value={form.reference} onChange={(e) => set('reference', e.target.value)} placeholder="Ex : REF-001" />
              </Field>
              <Field label="Marque / Fabricant" required error={errors.brand}>
                <select className={INPUT} value={form.brand} onChange={(e) => set('brand', e.target.value)}>
                  <option value="">Choisir une marque</option>
                  {BRANDS.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </Field>
              <Field label="Domaine / Spécialité" required error={errors.domain}>
                <select className={INPUT} value={form.domain} onChange={(e) => set('domain', e.target.value)}>
                  <option value="">Choisir un domaine</option>
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
              <textarea className={`${INPUT} resize-none`} rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Usage, cadence, compatibilité…" />
            </Field>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-4 w-full border-b border-line pb-2 text-base font-semibold">Image du produit</legend>
            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5 items-start">
              <ProductImage src={form.image} alt="Aperçu du produit" className="h-40 rounded-xl border border-line" />
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
                  <Upload size={16} aria-hidden="true" />
                  <span>Importer un fichier</span>
                  <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleFile(e.target.files?.[0])} />
                </label>
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-4 w-full border-b border-line pb-2 text-base font-semibold">Caractéristiques techniques</legend>
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
                    className="grid min-w-11 place-items-center rounded-lg border border-line-strong text-mute hover:border-signal hover:text-signal"
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => set('features', [...form.features, ''])} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
                <Plus size={16} aria-hidden="true" />
                Ajouter une caractéristique
              </button>
            </div>
          </fieldset>

          <fieldset className="space-y-5">
            <legend className="mb-4 w-full border-b border-line pb-2 text-base font-semibold">Disponibilité & publication</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Statut">
                <select className={INPUT} value={form.status} onChange={(e) => set('status', e.target.value as FormState['status'])}>
                  <option value="available">Disponible</option>
                  <option value="unavailable">Temporairement indisponible</option>
                </select>
              </Field>
              <div className="flex items-end">
                <label className="flex min-h-11 cursor-pointer items-center gap-3">
                  <input type="checkbox" checked={form.visible} onChange={(e) => set('visible', e.target.checked)} className="size-4 accent-brand" />
                  <span className="text-sm font-medium">Visible sur le site public</span>
                </label>
              </div>
            </div>

            {form.status === 'unavailable' && (
              <div className="grid grid-cols-1 gap-5 rounded-xl bg-amber-50 p-5 ring-1 ring-amber-200 md:grid-cols-2">
                <Field label="Date de retour estimée">
                  <input type="date" className={INPUT} value={form.expectedReturnDate} onChange={(e) => set('expectedReturnDate', e.target.value)} />
                </Field>
                <Field label="Note pour les clients">
                  <input className={INPUT} value={form.note} onChange={(e) => set('note', e.target.value)} placeholder="Ex : Réapprovisionnement en cours" />
                </Field>
              </div>
            )}
          </fieldset>
        </fieldset>

        {saveError && <p role="alert" className="px-5 pb-4 text-sm text-signal sm:px-8">{saveError}</p>}
        <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-line bg-paper px-5 py-4 sm:flex-row sm:justify-end sm:px-8">
          <button type="button" onClick={onClose} disabled={saving} className={BTN_GHOST}>Annuler</button>
          <button type="submit" disabled={saving} className={BTN_PRIMARY}>
            {saving ? 'Enregistrement…' : isEditing ? 'Enregistrer les modifications' : 'Créer le produit'}
          </button>
        </div>
      </form>
    </Modal>
  );
}