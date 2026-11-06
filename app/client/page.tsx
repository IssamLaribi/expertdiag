'tsx'
'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Package, Wrench, AlertCircle, PlusCircle, CheckCircle2, Clock } from 'lucide-react';

export default function ClientPortalPage() {
  const { role, currentCustomer, orders, problems, products, submitProblemReport } = useApp();
  const [activeTab, setActiveTab] = useState<'purchases' | 'sav'>('purchases');

  // SAV Form state
  const [selectedEqId, setSelectedEqId] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [problemType, setProblemType] = useState<'breakdown' | 'calibration' | 'error_message' | 'other'>('breakdown');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<'normal' | 'urgent'>('normal');
  const [savSuccessRef, setSavSuccessRef] = useState<string | null>(null);

  // Filter equipment products for SAV reporting (FR-46: Problem reports apply only to products of type equipment)
  const equipmentProducts = products.filter(p => p.type === 'equipment');

  const handleSavSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEqId) {
      alert('Veuillez sélectionner l\'équipement concerné.');
      return;
    }
    const ref = submitProblemReport(selectedEqId, serialNumber, problemType, description, urgency);
    setSavSuccessRef(ref);
    setSelectedEqId('');
    setSerialNumber('');
    setDescription('');
  };

  if (role !== 'customer') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Espace Réservé aux Clients Laboratoire</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Veuillez basculer votre mode d'accès en haut de page vers <strong>Client Labo</strong> pour accéder à vos achats et rapports SAV (Règle SRS FR-39).
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      
      {/* Customer Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
            Portail Client / Laboratoire
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-2">{currentCustomer.laboratoryName}</h1>
          <p className="text-sm text-slate-500 mt-0.5">Responsable : {currentCustomer.contactPerson} ({currentCustomer.email} | {currentCustomer.phone})</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
          <div><strong>Adresse :</strong> {currentCustomer.address}, {currentCustomer.commune}, {currentCustomer.wilaya}</div>
          <div><strong>Compte :</strong> Actif & Vérifié (Loi 18-07)</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('purchases')}
          className={`pb-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'purchases' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Mes Achats & Commandes ({orders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('sav')}
          className={`pb-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'sav' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Service Après-Vente (SAV) & Problèmes ({problems.length})</span>
        </button>
      </div>

      {/* Purchases Tab Content */}
      {activeTab === 'purchases' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">Historique des Achats & Demandes (FR-43)</h2>
            <span className="text-xs text-slate-500">Classé du plus récent au plus ancien</span>
          </div>

          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-blue-600 text-base">{order.reference}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                      order.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{order.createdAt}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
                  <div>
                    <strong className="block text-slate-400 uppercase tracking-wider mb-1">Mode de livraison</strong>
                    <span>{order.deliveryOptionName}</span>
                  </div>
                  <div>
                    <strong className="block text-slate-400 uppercase tracking-wider mb-1">Destination</strong>
                    <span>{order.address}, {order.commune} ({order.wilaya})</span>
                  </div>
                  <div>
                    <strong className="block text-slate-400 uppercase tracking-wider mb-1">Source</strong>
                    <span className="capitalize">{order.source === 'admin' ? 'Enregistré par Admin (Hors site)' : 'Site Web'}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Articles commandés</h4>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl text-xs">
                        <span className="font-semibold text-slate-800">{item.productName} <span className="font-mono text-blue-600">({item.reference})</span></span>
                        <span className="font-bold text-slate-900">Quantité : {item.quantity} {item.serialNumber && `| Série: ${item.serialNumber}`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SAV Tab Content */}
      {activeTab === 'sav' && (
        <div className="space-y-8">
          
          {/* Submit SAV Form */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Signaler un Problème sur un Équipement (SAV - FR-46)</h3>
                <p className="text-xs text-slate-500">Réservé aux équipements de laboratoire nécessitant maintenance ou étalonnage.</p>
              </div>
            </div>

            {savSuccessRef && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-sm text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Rapport SAV soumis avec succès ! Référence : <strong>{savSuccessRef}</strong>. L'équipe technique vous contactera.</span>
              </div>
            )}

            <form onSubmit={handleSavSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sélectionner l'Équipement</label>
                  <select
                    value={selectedEqId}
                    onChange={e => setSelectedEqId(e.target.value)}
                    required
                    className="w-full text-sm border border-slate-300 rounded-xl p-3 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">-- Choisir un équipement acheté --</option>
                    {equipmentProducts.map(eq => (
                      <option key={eq.id} value={eq.id}>{eq.name} ({eq.reference})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Numéro de Série (optionnel)</label>
                  <input
                    type="text"
                    value={serialNumber}
                    onChange={e => setSerialNumber(e.target.value)}
                    placeholder="Ex: SN-2026-9941"
                    className="w-full text-sm border border-slate-300 rounded-xl p-3 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Type de Problème</label>
                  <select
                    value={problemType}
                    onChange={e => setProblemType(e.target.value as any)}
                    className="w-full text-sm border border-slate-300 rounded-xl p-3 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="breakdown">Panne / Dysfonctionnement matériel</option>
                    <option value="calibration">Besoin de réétalonnage</option>
                    <option value="error_message">Message d'erreur récurent</option>
                    <option value="other">Autre problème technique</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Niveau d'Urgence</label>
                  <select
                    value={urgency}
                    onChange={e => setUrgency(e.target.value as any)}
                    className="w-full text-sm border border-slate-300 rounded-xl p-3 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent (Arrêt de service labo)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description détaillée du problème</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Décrivez les symptômes, codes erreurs affichés..."
                  className="w-full text-sm border border-slate-300 rounded-xl p-3 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md transition flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Soumettre le Signalement SAV</span>
              </button>
            </form>
          </div>

          {/* List of SAV Problems & Status Tracking (FR-49) */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Suivi de vos Rapports SAV (FR-49)</h3>
            
            {problems.map(prob => (
              <div key={prob.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-blue-600 text-base">{prob.reference}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      prob.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                      prob.status === 'In progress' ? 'bg-blue-100 text-blue-800' :
                      prob.status === 'Intervention scheduled' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {prob.status}
                    </span>
                    {prob.urgency === 'urgent' && (
                      <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full">Urgent</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">{prob.createdAt}</div>
                </div>

                <div className="text-sm font-semibold text-slate-900">
                  Équipement : {prob.equipmentName} {prob.serialNumber && `(S/N: ${prob.serialNumber})`}
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                  <strong>Description :</strong> {prob.description}
                </p>

                {prob.plannedInterventionDate && (
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900">
                    <strong>Intervention planifiée sur site :</strong> {prob.plannedInterventionDate}
                  </div>
                )}

                {prob.messageToCustomer && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
                    <strong>Message de l'équipe SAV :</strong> {prob.messageToCustomer}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
