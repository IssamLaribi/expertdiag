'tsx'
'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Trash2, Plus, Minus, ShoppingCart, Truck, CheckCircle2, AlertCircle } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ALGERIAN_WILAYAS = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar',
  'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger',
  'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma',
  'Constantine', 'Médéa', 'Mostaganem', 'M\'Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
  'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued',
  'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent',
  'Ghardaïa', 'Relizane', 'Timimoun', 'Bordj Badji Mokhtar', 'Ouled Djellal', 'Béni Abbès',
  'In Salah', 'In Guezzam', 'Touggourt', 'Djanet', 'El M\'Ghair', 'El Meniaa'
];

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateCartQuantity, deliveryOptions, submitOrder, role, setRole, currentCustomer } = useApp();
  
  const [selectedDelivery, setSelectedDelivery] = useState(deliveryOptions[0]?.id || '');
  const [wilaya, setWilaya] = useState(currentCustomer.wilaya);
  const [commune, setCommune] = useState(currentCustomer.commune);
  const [address, setAddress] = useState(currentCustomer.address);
  const [comment, setComment] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'visitor') {
      alert('Veuillez vous connecter en tant que "Client Labo" pour soumettre une demande de devis/commande (Règle SRS FR-39). Passage automatique en mode Client.');
      setRole('customer');
      return;
    }
    if (cart.length === 0) return;

    const ref = submitOrder(selectedDelivery, address, wilaya, commune, comment);
    setSubmittedRef(ref);
  };

  const activeDeliveryOpt = deliveryOptions.find(d => d.id === selectedDelivery);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Panier de Demande & Devis</h2>
              <p className="text-xs text-slate-500">Réactifs, équipements et consommables</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {submittedRef ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Demande Soumise avec Succès !</h3>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                Votre référence de demande est <span className="font-mono font-bold text-blue-600">{submittedRef}</span>. Un e-mail de confirmation vous a été envoyé ainsi qu'à l'équipe Expert Diagnostic.
              </p>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-800 text-left">
                <strong>Important (FR-24) :</strong> Cette demande n'est pas un achat final en ligne. L'équipe commerciale d'Expert Diagnostic vous contactera par téléphone ou e-mail pour confirmer les prix, les frais de livraison et la disponibilité.
              </div>
              <button
                onClick={() => { setSubmittedRef(null); onClose(); }}
                className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium shadow-md hover:bg-blue-700 transition"
              >
                Retour au catalogue
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <p className="text-slate-600 font-medium">Votre panier de demande est vide.</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Parcourez notre catalogue et ajoutez des produits pour constituer votre demande de devis.
              </p>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Produits sélectionnés ({cart.length})</h4>
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded-lg border border-slate-200" />
                      <div>
                        <h5 className="text-sm font-semibold text-slate-900 line-clamp-1">{item.product.name}</h5>
                        <span className="text-xs font-mono text-blue-600">{item.product.reference}</span>
                        <div className="text-xs font-medium text-slate-500">{item.product.priceEstimate || 'Sur devis'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-100 text-slate-600 rounded-l-lg transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-sm font-semibold text-slate-800">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-slate-100 text-slate-600 rounded-r-lg transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Options (US-2) */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-blue-600" />
                  Mode de Livraison (US-2)
                </h4>
                <div className="space-y-2">
                  {deliveryOptions.filter(d => d.active).map(option => (
                    <label
                      key={option.id}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                        selectedDelivery === option.id ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryOption"
                        value={option.id}
                        checked={selectedDelivery === option.id}
                        onChange={() => setSelectedDelivery(option.id)}
                        className="mt-1 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-slate-900">{option.name}</div>
                        <div className="text-xs text-blue-700 font-medium mt-0.5">Délai estimé : {option.estimatedDays}</div>
                        <div className="text-xs text-slate-500 mt-1">Wilayas : {option.coveredWilayas.join(', ')}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Delivery Address & Lab info */}
              <form id="order-form" onSubmit={handleCheckout} className="space-y-4 pt-4 border-t border-slate-200">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Coordonnées Laboratoire & Adresse</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Wilaya de Destination</label>
                    <select
                      value={wilaya}
                      onChange={(e) => setWilaya(e.target.value)}
                      className="w-full text-sm border border-slate-300 rounded-xl p-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      {ALGERIAN_WILAYAS.map(w => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Commune</label>
                    <input
                      type="text"
                      value={commune}
                      onChange={(e) => setCommune(e.target.value)}
                      required
                      className="w-full text-sm border border-slate-300 rounded-xl p-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Adresse Exacte</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full text-sm border border-slate-300 rounded-xl p-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Commentaire optionnel</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Instructions particulières, horaires de réception..."
                    rows={2}
                    className="w-full text-sm border border-slate-300 rounded-xl p-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>

                {role === 'visitor' && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2.5 text-xs text-blue-800">
                    <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Vous naviguez en tant que visiteur. La soumission basculera automatiquement votre session en mode <strong>Client Labo</strong> (FR-39).</span>
                  </div>
                )}
              </form>
            </>
          )}
        </div>

        {/* Drawer Footer */}
        {!submittedRef && cart.length > 0 && (
          <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500">Total articles</div>
              <div className="text-lg font-bold text-slate-900">{cart.reduce((sum, i) => sum + i.quantity, 0)} unités</div>
            </div>
            <button
              type="submit"
              form="order-form"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-600/20 transition flex items-center gap-2"
            >
              <span>Soumettre la Demande</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
