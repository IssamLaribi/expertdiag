'tsx'
'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, AlertTriangle, ArrowLeft, ShoppingCart } from 'lucide-react';

export function ProductDetailClient({ id }: { id: string }) {
  const { products, addToCart } = useApp();

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Produit introuvable</h2>
        <p className="text-sm text-slate-500">Le produit demandé n'existe pas ou a été retiré du catalogue.</p>
        <Link href="/catalogue" className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium text-sm">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/catalogue" className="hover:text-blue-600 transition flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Retour au catalogue
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">{product.name}</span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10">
        
        {/* Product Image */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 h-[400px]">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide shadow-sm flex items-center gap-1.5 ${
                product.status === 'available'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-100 text-rose-800 border border-rose-200'
              }`}>
                {product.status === 'available' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Disponible immédiatement
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Temporairement indisponible
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                {product.domain}
              </span>
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                Ref : {product.reference}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{product.name}</h1>
            
            <div className="text-sm font-semibold text-slate-700">
              Fabricant : <span className="text-blue-600">{product.brand}</span> | Type : <span className="capitalize">{product.type}</span>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">{product.description}</p>

            {product.status === 'unavailable' && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs text-amber-800">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Indisponibilité temporaire (FR-13)
                </div>
                {product.expectedReturnDate && <div><strong>Date de retour estimée :</strong> {product.expectedReturnDate}</div>}
                {product.note && <div>{product.note}</div>}
              </div>
            )}

            {/* Features list */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Caractéristiques techniques</h3>
              <ul className="space-y-2">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5"></span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 block">Tarif & Modalité</span>
              <span className="text-xl font-extrabold text-slate-900">{product.priceEstimate || 'Sur devis'}</span>
            </div>

            {product.status === 'available' ? (
              <button
                onClick={() => addToCart(product)}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-600/30 transition flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Ajouter à la Demande</span>
              </button>
            ) : (
              <Link
                href="/contact"
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl shadow-md transition flex items-center gap-2"
              >
                <span>Nous Contacter / Me Notifier</span>
              </Link>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
