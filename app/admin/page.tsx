'tsx'
'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Shield, Package, ShoppingCart, Wrench, Plus, CheckCircle2, AlertTriangle, RefreshCw, Eye, Edit3, Trash2, Lock, Mail, ArrowUpRight } from 'lucide-react';

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

  const [activeTab, setActiveTab] = useState<'stats' | 'catalog' | 'orders' | 'sav'>('stats');

  // Add Product modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProd, setNewProd] = useState({
    name: '',
    reference: '',
    type: 'reagent' as const,
    brand: brands[0]?.name || 'Mindray',
    domain: domains[0]?.name || 'Biochimie',
    description: '',
    features: ['Qualité certifiée'],
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=900',
    status: 'available' as const,
    visible: true,
    priceEstimate: 'Sur devis'
  });

  // Offline purchase modal state
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [offProductId, setOffProductId] = useState(products[0]?.id || '');
  const [offQty, setOffQty] = useState(1);
  const [offSerial, setOffSerial] = useState('');

  // SAV editing modal state
  const [editingProblemId, setEditingProblemId] = useState<string | null>(null);
  const [savStatus, setSavStatus] = useState<any>('In progress');
  const [savDate, setSavDate] = useState('');
  const [savMsg, setSavMsg] = useState('');
  const [savNote, setSavNote] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail && adminPassword) {
      setRole('admin');
    } else {
      setLoginError(true);
    }
  };

  if (role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto px-6 py-24">
        <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-xl space-y-8">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Espace Administration</h1>
            <p className="text-sm text-slate-500">
              Connexion sécurisée réservée au personnel autorisé d'Expert Diagnostic (Règle SRS FR-25).
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Adresse e-mail admin</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                />
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl font-medium">
                Identifiants incorrects. Veuillez réessayer.
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/20 transition flex items-center justify-center gap-2"
            >
              <span>Se connecter au Back-Office</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setRole('admin')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 transition"
              >
                Accès Rapide Démo (Connexion directe Admin) →
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct(newProd);
    setShowAddModal(false);
    setNewProd({
      name: '',
      reference: '',
      type: 'reagent',
      brand: brands[0]?.name || 'Mindray',
      domain: domains[0]?.name || 'Biochimie',
      description: '',
      features: ['Qualité certifiée'],
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=900',
      status: 'available',
      visible: true,
      priceEstimate: 'Sur devis'
    });
  };

  const handleSaveSavEdit = (probId: string) => {
    updateProblemStatus(probId, savStatus, savDate, savMsg, savNote);
    setEditingProblemId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 space-y-10 bg-white">
      
      {/* Admin Header */}
      <div className="bg-slate-900 text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3.5 py-1 rounded-full text-xs font-bold border border-emerald-500/30">
            <Shield className="w-3.5 h-3.5" />
            <span>Session Admin Active ({adminEmail})</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Tableau de Bord Back-Office</h1>
          <p className="text-sm text-slate-400">Gestion centralisée du catalogue, des commandes clients et du service après-vente (SAV).</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Produit</span>
          </button>
          <button
            onClick={() => setShowOfflineModal(true)}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Achat Hors-Site (FR-45)</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-200 gap-8 font-semibold text-sm">
        <button
          onClick={() => setActiveTab('stats')}
          className={`pb-4 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'stats' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Statistiques & Synthèse</span>
        </button>
        <button
          onClick={() => setActiveTab('catalog')}
          className={`pb-4 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'catalog' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Catalogue & Stocks ({products.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-4 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'orders' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Demandes & Commandes ({orders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('sav')}
          className={`pb-4 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'sav' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Rapports SAV ({problems.length})</span>
        </button>
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-50 p-8 rounded-3xl space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Produits</div>
            <div className="text-4xl font-black text-slate-900">{products.length}</div>
            <div className="text-xs text-emerald-600 font-semibold">Catalogue actif</div>
          </div>
          <div className="bg-slate-50 p-8 rounded-3xl space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Demandes Reçues</div>
            <div className="text-4xl font-black text-blue-600">{orders.length}</div>
            <div className="text-xs text-slate-500 font-semibold">Commandes & Devis</div>
          </div>
          <div className="bg-slate-50 p-8 rounded-3xl space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tickets SAV Actifs</div>
            <div className="text-4xl font-black text-amber-600">{problems.filter(p => p.status !== 'Resolved' && p.status !== 'Closed').length}</div>
            <div className="text-xs text-slate-500 font-semibold">Interventions en cours</div>
          </div>
          <div className="bg-slate-50 p-8 rounded-3xl space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Disponibilité Stock</div>
            <div className="text-4xl font-black text-emerald-600">{products.filter(p => p.status === 'available').length} / {products.length}</div>
            <div className="text-xs text-slate-500 font-semibold">Produits disponibles</div>
          </div>
        </div>
      )}

      {/* Catalog Management Tab */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">Gestion des Produits & Disponibilité (US-1)</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition"
            >
              Ajouter un Produit
            </button>
          </div>

          <div className="bg-slate-50 rounded-3xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-5">Produit</th>
                  <th className="p-5">Référence</th>
                  <th className="p-5">Domaine</th>
                  <th className="p-5">Type</th>
                  <th className="p-5">Disponibilité (US-1)</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 text-sm">
                {products.map(prod => (
                  <tr key={prod.id} className="hover:bg-slate-100/50 transition">
                    <td className="p-5 flex items-center gap-3">
                      <img src={prod.image} alt={prod.name} className="w-12 h-12 object-cover rounded-xl border border-slate-200" />
                      <span className="font-bold text-slate-900 line-clamp-1">{prod.name}</span>
                    </td>
                    <td className="p-5 font-mono text-xs font-bold text-blue-600">{prod.reference}</td>
                    <td className="p-5 text-slate-600">{prod.domain}</td>
                    <td className="p-5 text-slate-600 capitalize">{prod.type}</td>
                    <td className="p-5">
                      <button
                        onClick={() => toggleProductAvailability(prod.id)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 w-fit ${
                          prod.status === 'available'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {prod.status === 'available' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                        <span>{prod.status === 'available' ? 'Disponible' : 'Indisponible'}</span>
                      </button>
                    </td>
                    <td className="p-5 text-right space-x-2">
                      <button
                        onClick={() => deleteProduct(prod.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Management Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Demandes et Commandes Clients (FR-29)</h2>
          
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-slate-50 p-8 rounded-3xl space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-blue-600 text-base">{order.reference}</span>
                    <span className="text-sm font-bold text-slate-900">{order.laboratoryName} ({order.customerName})</span>
                  </div>
                  <div>
                    <select
                      value={order.status}
                      onChange={e => updateOrderStatus(order.id, e.target.value)}
                      className="text-xs font-bold py-2 px-3 bg-white border border-slate-300 rounded-xl outline-none"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
                  <div>
                    <strong className="block text-slate-400 uppercase tracking-wider mb-1">Contact</strong>
                    <span>{order.email} | {order.phone}</span>
                  </div>
                  <div>
                    <strong className="block text-slate-400 uppercase tracking-wider mb-1">Livraison</strong>
                    <span>{order.deliveryOptionName} - {order.address}, {order.wilaya}</span>
                  </div>
                  <div>
                    <strong className="block text-slate-400 uppercase tracking-wider mb-1">Date</strong>
                    <span>{order.createdAt}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Articles de la demande</h4>
                  <div className="space-y-2">
                    {order.items.map((i, idx) => (
                      <div key={idx} className="text-xs text-slate-800 bg-white p-3 rounded-2xl flex justify-between font-medium">
                        <span>{i.productName} ({i.reference})</span>
                        <span className="font-bold">Qté : {i.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SAV Management Tab */}
      {activeTab === 'sav' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Gestion des Rapports SAV & Problèmes (FR-50)</h2>

          <div className="space-y-6">
            {problems.map(prob => (
              <div key={prob.id} className="bg-slate-50 p-8 rounded-3xl space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-blue-600 text-base">{prob.reference}</span>
                    <span className="text-sm font-bold text-slate-900">{prob.laboratoryName}</span>
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        setEditingProblemId(prob.id);
                        setSavStatus(prob.status);
                        setSavDate(prob.plannedInterventionDate || '');
                        setSavMsg(prob.messageToCustomer || '');
                        setSavNote(prob.internalNote || '');
                      }}
                      className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl"
                    >
                      Traiter / Mettre à jour
                    </button>
                  </div>
                </div>

                <div className="text-sm font-bold text-slate-900">
                  Équipement : {prob.equipmentName} {prob.serialNumber && `(S/N: ${prob.serialNumber})`}
                </div>
                <p className="text-xs text-slate-600 bg-white p-4 rounded-2xl">
                  <strong>Description :</strong> {prob.description}
                </p>

                {editingProblemId === prob.id ? (
                  <div className="p-6 bg-white rounded-2xl space-y-4 border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-700 uppercase">Mise à jour du dossier SAV</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Statut</label>
                        <select
                          value={savStatus}
                          onChange={e => setSavStatus(e.target.value)}
                          className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl"
                        >
                          <option value="New">New</option>
                          <option value="In progress">In progress</option>
                          <option value="Intervention scheduled">Intervention scheduled</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Date d'intervention planifiée</label>
                        <input
                          type="text"
                          value={savDate}
                          onChange={e => setSavDate(e.target.value)}
                          placeholder="Ex: 2026-11-15 10:00"
                          className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Message visible par le client</label>
                      <textarea
                        rows={2}
                        value={savMsg}
                        onChange={e => setSavMsg(e.target.value)}
                        className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Note interne (Admin uniquement)</label>
                      <input
                        type="text"
                        value={savNote}
                        onChange={e => setSavNote(e.target.value)}
                        className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleSaveSavEdit(prob.id)}
                        className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl"
                      >
                        Enregistrer
                      </button>
                      <button
                        onClick={() => setEditingProblemId(null)}
                        className="px-5 py-2.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-purple-50 text-purple-900 rounded-2xl">
                      <strong>Intervention :</strong> {prob.plannedInterventionDate || 'Non planifiée'}
                    </div>
                    <div className="p-4 bg-blue-50 text-blue-900 rounded-2xl">
                      <strong>Message Client :</strong> {prob.messageToCustomer || 'Aucun message'}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900">Ajouter un nouveau produit</h3>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nom du Produit</label>
                <input
                  type="text"
                  required
                  value={newProd.name}
                  onChange={e => setNewProd({...newProd, name: e.target.value})}
                  className="w-full text-sm p-3 border border-slate-300 rounded-xl"
                  placeholder="Ex: Analyseur..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Référence</label>
                  <input
                    type="text"
                    required
                    value={newProd.reference}
                    onChange={e => setNewProd({...newProd, reference: e.target.value})}
                    className="w-full text-sm p-3 border border-slate-300 rounded-xl"
                    placeholder="REF-001"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={newProd.type}
                    onChange={e => setNewProd({...newProd, type: e.target.value as any})}
                    className="w-full text-sm p-3 border border-slate-300 rounded-xl"
                  >
                    <option value="equipment">Équipement</option>
                    <option value="reagent">Réactif</option>
                    <option value="consumable">Consommable</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Domaine</label>
                  <select
                    value={newProd.domain}
                    onChange={e => setNewProd({...newProd, domain: e.target.value})}
                    className="w-full text-sm p-3 border border-slate-300 rounded-xl"
                  >
                    {domains.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Marque</label>
                  <select
                    value={newProd.brand}
                    onChange={e => setNewProd({...newProd, brand: e.target.value})}
                    className="w-full text-sm p-3 border border-slate-300 rounded-xl"
                  >
                    {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={newProd.description}
                  onChange={e => setNewProd({...newProd, description: e.target.value})}
                  className="w-full text-sm p-3 border border-slate-300 rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl"
                >
                  Créer le Produit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Offline Purchase Modal (FR-45) */}
      {showOfflineModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900">Enregistrer un Achat Hors-Site (FR-45)</h3>
            <p className="text-xs text-slate-500">Permet d'ajouter un achat effectué hors site dans l'historique d'un client.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Produit</label>
                <select
                  value={offProductId}
                  onChange={e => setOffProductId(e.target.value)}
                  className="w-full text-sm p-3 border border-slate-300 rounded-xl"
                >
                  {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.reference})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Quantité</label>
                  <input
                    type="number"
                    min={1}
                    value={offQty}
                    onChange={e => setOffQty(parseInt(e.target.value) || 1)}
                    className="w-full text-sm p-3 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">N° de Série (si équipement)</label>
                  <input
                    type="text"
                    value={offSerial}
                    onChange={e => setOffSerial(e.target.value)}
                    className="w-full text-sm p-3 border border-slate-300 rounded-xl"
                    placeholder="SN-..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowOfflineModal(false)}
                  className="px-5 py-2.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => {
                    recordOfflinePurchase('cust-1', offProductId, offQty, offSerial);
                    setShowOfflineModal(false);
                    alert('Achat hors site enregistré avec succès et rattaché à l\'historique client (FR-45).');
                  }}
                  className="px-6 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl"
                >
                  Enregistrer l'Achat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
