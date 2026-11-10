'use client';

import React, { useMemo, useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Shield,
  ShoppingCart,
  Plus,
  CheckCircle2,
  LogOut,
} from 'lucide-react';
import {
  Product,
  TabId,
  TABS,
  OFFLINE_CUSTOMER_ID,
  CONTAINER,
  FOCUS,
  BTN_PRIMARY,
  BTN_SUCCESS,
} from './constants';
import { AddProductModal } from './components/AddProductModal';
import { OfflinePurchaseModal } from './components/OfflinePurchaseModal';
import { AdminLogin } from './components/AdminLogin';
import { StatsTab } from './components/StatsTab';
import { CatalogTab } from './components/CatalogTab';
import { OrdersTab } from './components/OrdersTab';
import { SavTab } from './components/SavTab';

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
      <AdminLogin
        adminEmail={adminEmail}
        setAdminEmail={setAdminEmail}
        adminPassword={adminPassword}
        setAdminPassword={setAdminPassword}
        loginError={loginError}
        onLogin={handleLogin}
        onDemoLogin={() => setRole('admin')}
      />
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
            {tab === 'stats' && (
              <StatsTab
                products={products}
                orders={orders}
                newOrders={newOrders}
                activeProblems={activeProblems}
                urgentProblems={urgentProblems}
                availableCount={availableCount}
                onSelectTab={setTab}
              />
            )}

            {tab === 'catalog' && (
              <CatalogTab
                filteredProducts={filteredProducts}
                domains={domains}
                query={query}
                setQuery={setQuery}
                fDomain={fDomain}
                setFDomain={setFDomain}
                fType={fType}
                setFType={setFType}
                fStatus={fStatus}
                setFStatus={setFStatus}
                onOpenAddModal={() => setShowAddModal(true)}
                onToggleAvailability={toggleProductAvailability}
                onRemoveProduct={removeProduct}
              />
            )}

            {tab === 'orders' && (
              <OrdersTab
                shownOrders={shownOrders}
                oFilter={oFilter}
                setOFilter={setOFilter}
                onUpdateOrderStatus={updateOrderStatus}
              />
            )}

            {tab === 'sav' && (
              <SavTab
                problems={problems}
                onSaveProblem={(prob, status, date, msg, note) => {
                  updateProblemStatus(prob.id, status, date, msg, note);
                  notify(`Dossier ${prob.reference} mis à jour.`);
                }}
              />
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