'use client';

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Product, INPUT, BTN_SUCCESS, BTN_GHOST } from '../constants';
import { Field, Modal } from './AdminUI';

export function OfflinePurchaseModal({
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