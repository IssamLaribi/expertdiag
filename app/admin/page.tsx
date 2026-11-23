'use client';

import React, { useMemo, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { normalizeCatalogueText } from '@/lib/catalogue';
import {
  ShoppingCart,
  Plus,
  CheckCircle2,
  LogOut,
} from 'lucide-react';
import {
  Product,
  TabId,
  TABS,
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
    productsLoading,
    currentCustomer,
    domains,
    brands,
    orders,
    problems,
    addProduct,
    deleteProduct,
    updateProduct,
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
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
    const q = normalizeCatalogueText(query);
    return products.filter((p) => {
      if (fDomain !== 'all' && normalizeCatalogueText(p.domain) !== normalizeCatalogueText(fDomain)) return false;
      if (fType !== 'all' && p.type !== fType) return false;
      if (fStatus !== 'all' && p.status !== fStatus) return false;
      if (q && !normalizeCatalogueText(`${p.name} ${p.brand} ${p.reference}`).includes(q)) return false;
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

  const createProduct = async (payload: Omit<Product, 'id'>) => {
    await addProduct(payload);
    setShowAddModal(false);
    notify(`« ${payload.name} » a été ajouté au catalogue.`);
  };

  const editProduct = (p: Product) => {
    setSelectedProduct(p);
    setShowEditModal(true);
  };

  const removeProduct = async (product: Product) => {
    if (!window.confirm(`Supprimer définitivement « ${product.name} » ?`)) return;
    await deleteProduct(product.id);
    notify(`« ${product.name} » a été supprimé.`);
  };

  return (
    <div className="min-h-[65vh] bg-paper">
      <div className="border-b border-line bg-white">
        <div className="site-width flex flex-wrap items-end justify-between gap-4 py-6 sm:py-8">
          <div>
            <p className="text-sm text-mute">Back-office · {adminEmail}</p>
            <h1 className="page-title mt-1">Administration</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {tab !== 'catalog' && (
              <button type="button" onClick={() => setShowAddModal(true)} disabled={productsLoading} className="button-primary">
                <Plus size={17} aria-hidden="true" /> Nouveau produit
              </button>
            )}
            <button type="button" onClick={() => setShowOfflineModal(true)} className="button-secondary">
              <ShoppingCart size={17} aria-hidden="true" /> Achat hors site
            </button>
            <button type="button" onClick={() => setRole('visitor')} className="button-secondary">
              <LogOut size={17} aria-hidden="true" /> Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="site-width space-y-6 py-8">
        {toast && (
          <div role="status" className="flex items-center gap-3 rounded-xl bg-ok/10 px-4 py-3 text-sm font-medium text-ok">
            <CheckCircle2 size={18} className="shrink-0 text-ok" aria-hidden="true" />
            <span>{toast}</span>
          </div>
        )}

        <div className="grid items-start gap-6 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-8">
          <nav aria-label="Sections du back-office" className="card flex gap-1 overflow-x-auto p-1.5 lg:sticky lg:top-24 lg:grid">
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = tab === id;
              const badge = badges[id];
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex min-h-11 shrink-0 items-center gap-2.5 rounded-lg px-3 text-sm font-medium whitespace-nowrap transition-colors lg:w-full ${
                    active ? 'bg-brand text-white' : 'text-ink/70 hover:bg-paper hover:text-ink'
                  }`}
                >
                  <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                  <span className="flex-1 text-left">{label}</span>
                  {badge ? <span className={`min-w-5 rounded-full px-1.5 text-center text-xs font-semibold tabular-nums ${active ? 'bg-white/20' : 'bg-signal text-white'}`}>{badge}</span> : null}
                </button>
              );
            })}
          </nav>

          <div className="min-w-0">
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
                productsLoading={productsLoading}
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
                onEditProduct={editProduct}
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
          </div>
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

      {showEditModal && selectedProduct && (
        <AddProductModal
          product={selectedProduct}
          products={products}
          domains={domains}
          brands={brands}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProduct(null);
          }}
          onSave={async (payload) => {
            await updateProduct({ ...payload, id: selectedProduct.id });
            setShowEditModal(false);
            setSelectedProduct(null);
            notify(`« ${payload.name} » a été modifié.`);
          }}
        />
      )}

      {showOfflineModal && (
        <OfflinePurchaseModal
          products={products}
          onClose={() => setShowOfflineModal(false)}
          onSave={(productId, qty, serial) => {
            recordOfflinePurchase(currentCustomer.id, productId, qty, serial);
            setShowOfflineModal(false);
            notify('Achat hors-site enregistré et rattaché à l’historique client.');
          }}
        />
      )}
    </div>
  );
}