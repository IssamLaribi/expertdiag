'use client';

import React, { useState } from 'react';
import { Product, INPUT, BTN_PRIMARY, BTN_GHOST } from '../constants';
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
    <Modal title="Achat hors site" onClose={onClose} maxWidth="max-w-xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (productId) onSave(productId, qty, serial.trim());
        }}
      >
        <div className="space-y-5 p-5 sm:p-8">
          <p className="text-sm leading-relaxed text-mute">
            Ajoute à l’historique du client un achat conclu hors du site, par téléphone par exemple.
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
        <div className="flex flex-col-reverse gap-3 border-t border-line bg-paper px-5 py-4 sm:flex-row sm:justify-end sm:px-8">
          <button type="button" onClick={onClose} className={BTN_GHOST}>Annuler</button>
          <button type="submit" className={BTN_PRIMARY}>
            Enregistrer l’achat
          </button>
        </div>
      </form>
    </Modal>
  );
}