'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Search, Filter, RotateCcw, CheckCircle2, AlertTriangle, Microscope, Package } from 'lucide-react';

function CatalogueContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialDomain = searchParams.get('domain') || 'all';

  const { products, domains, brands, addToCart } = useApp();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedDomain, setSelectedDomain] = useState(initialDomain);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Filter products according to SRS requirements (FR-1 to FR-9)
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (!product.visible) return false;

      // Domain filter (FR-3, FR-5)
      if (selectedDomain !== 'all' && product.domain !== selectedDomain) {
        return false;
      }

      // Brand filter (FR-4, FR-5)
      if (selectedBrand !== 'all' && product.brand !== selectedBrand) {
        return false;
      }

      // Type filter
      if (selectedType !== 'all' && product.type !== selectedType) {
        return false;
      }

      // Availability filter (FR-8)
      if (onlyAvailable && product.status !== 'available') {
        return false;
      }

      // Keyword search (FR-6: searches name, brand, reference)
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(q);
        const matchBrand = product.brand.toLowerCase().includes(q);
        const matchRef = product.reference.toLowerCase().includes(q);
        const matchDesc = product.description.toLowerCase().includes(q);
        if (!matchName && !matchBrand && !matchRef && !matchDesc) {
          return false;
        }
      }

      return true;
    });
  }, [products, selectedDomain, selectedBrand, selectedType, onlyAvailable, searchQuery]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDomain('all');
    setSelectedBrand('all');
    setSelectedType('all');
    setOnlyAvailable(false);
  };

  return (
    <div className="max-w-[1760px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-20 py-10 space-y-8 bg-white">
      
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Catalogue Officiel</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Réactifs, Équipements & Consommables</h1>
          <p className="text-sm text-slate-500 mt-1">Recherchez et filtrez l'ensemble des solutions de diagnostic accréditées.</p>
        </div>
        <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-xl text-sm font-semibold border border-blue-100 flex items-center gap-2 self-start md:self-auto">
          <Package className="w-4 h-4 text-blue-600" />
          <span>{filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6 bg-white p-6 rounded-2xl border border-slate-200 h-fit shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" />
              Filtres Avancés
            </h3>
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Réinitialiser
            </button>
          </div>

          {/* Keyword Search (FR-6) */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Recherche par mot-clé</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nom, marque, référence..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Domain / Specialty Filter (FR-3, FR-5) */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Domaine / Spécialité</label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">Tous les domaines</option>
              {domains.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Brand Filter (FR-4, FR-5) */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Marque / Fabricant</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">Toutes les marques</option>
              {brands.map(b => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Product Type Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Type de Produit</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">Tous les types</option>
              <option value="equipment">Équipement / Analyseur</option>
              <option value="reagent">Réactif</option>
              <option value="consumable">Consommable</option>
            </select>
          </div>

          {/* Availability Filter (FR-8) */}
          <div className="pt-2 border-t border-slate-200">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
              />
              <span className="text-sm font-medium text-slate-700">Disponibles uniquement</span>
            </label>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            /* Zero results state (FR-7) */
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Aucun produit ne correspond à vos critères</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Essayez de modifier vos filtres de recherche, de changer de domaine ou de réinitialiser la recherche pour voir tous les produits.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md transition inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col group">
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-sm flex items-center gap-1 ${
                        product.status === 'available'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {product.status === 'available' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Disponible
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            Temporairement indisponible
                          </>
                        )}
                      </span>
                    </div>
                    {/*<div className="absolute top-3 right-3">
                      <span className="bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-mono font-medium">
                        {product.brand}
                      </span>
                    </div>*/}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-1">
                        <span className="text-blue-600 uppercase">{product.domain}</span>
                        <span className="font-mono text-slate-500">{product.reference}</span>
                      </div>
                      <Link href={`/catalogue/${product.id}`}>
                        <h3 className="font-bold text-slate-900 text-base hover:text-blue-600 transition line-clamp-1">{product.name}</h3>
                      </Link>
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">{product.description}</p>
                      
                      {product.status === 'unavailable' && product.expectedReturnDate && (
                        <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                          <strong>Retour estimé :</strong> {product.expectedReturnDate}
                          {product.note && <div className="text-amber-700 mt-0.5">{product.note}</div>}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 block">Prix / Devis</span>
                        <span className="text-sm font-bold text-slate-900">{product.priceEstimate || 'Sur devis'}</span>
                      </div>
                      {/*product.status === 'available' ? (
                        <button
                          onClick={() => addToCart(product)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition"
                        >
                          Demander
                        </button>
                      ) : (
                        <span className="text-xs text-rose-600 font-medium px-3 py-1.5 bg-rose-50 rounded-lg">
                          Indisponible
                        </span>
                      )*/}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function CataloguePage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-slate-500">Chargement du catalogue...</div>}>
      <CatalogueContent />
    </Suspense>
  );
}