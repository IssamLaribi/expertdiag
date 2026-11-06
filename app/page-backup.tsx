'tsx'
'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Search, Microscope, ShieldCheck, Truck, ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const { products, domains, addToCart } = useApp();

  const featuredProducts = products.filter(p => p.visible).slice(0, 4);

  return (
    <div className="space-y-24 pb-28 bg-white">
      {/* Hero Section matching example.jpeg */}
      <section className="relative bg-white pt-12 pb-20 px-6 sm:px-12 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <div className="lg:col-span-6 space-y-8">

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.08]">
              La précision commence par le bon <span className="text-blue-600">partenaire.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-lg leading-relaxed font-normal">
              Réactifs, analyseurs et consommables. L'essentiel pour votre laboratoire, accompagné par une équipe à votre écoute.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/catalogue"
                className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-3 group"
              >
                <span>Explorer le catalogue</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </Link>

              <Link
                href="/a-propos"
                className="px-6 py-4 text-slate-800 font-semibold text-sm hover:text-blue-600 transition flex items-center justify-center gap-2"
              >
                <span>Découvrir Expert Diagnostic</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-100">
              <img
                src="https://img.magnific.com/premium-photo/closeup-scientific-equipment-including-centrifuges-modern-laboratory-setting_1218113-1335.jpg?semt=ais_hybrid&w=740&q=80"
                alt="Laboratoire Clinique Automatisé"
                className="w-full h-[460px] object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Specialty Domains Grid (Minimal borders) */}
      {/*<section className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Spécialités Analytiques</span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">Domaines de Biologie Médicale</h2>
          </div>
          <Link href="/catalogue" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition">
            <span>Voir tout le catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {domains.map((dom) => (
            <Link
              key={dom.id}
              href={`/catalogue?domain=${encodeURIComponent(dom.name)}`}
              className="bg-slate-50 hover:bg-blue-50/50 p-8 rounded-3xl transition group text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-white text-blue-600 flex items-center justify-center mx-auto shadow-sm group-hover:bg-blue-600 group-hover:text-white transition">
                <Microscope className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm tracking-wide">{dom.name}</h3>
            </Link>
          ))}
        </div>
      </section>*/}

      <section className="max-w-7xl mx-auto px-6 sm:px-12 py-20">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-blue-600" />
              <span className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em]">
                Spécialités analytiques
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Explorez nos domaines
              <span className="text-blue-600"> de biologie médicale.</span>
            </h2>

            <p className="text-slate-500 mt-4 text-sm sm:text-base leading-relaxed max-w-xl">
              Découvrez notre sélection d'équipements et de solutions
              adaptés aux différentes spécialités de laboratoire.
            </p>
          </div>

          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition group shrink-0"
          >
            Explorer le catalogue
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Domain Cards */}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {domains.map((dom) => (
            <Link
              key={dom.id}
              href={`/catalogue?domain=${encodeURIComponent(dom.name)}`}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white hover:shadow-xl hover:shadow-blue-900/10 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-40 sm:h-44 overflow-hidden bg-slate-100">
                <img
                  src={dom.image}
                  alt={dom.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />

                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-blue-600 opacity-0 group-hover:opacity-100 transition">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                  {dom.name}
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  Découvrir les équipements
                </p>
              </div>
            </Link>
          ))}
        </div>

      </section>


      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Équipements & Réactifs</span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">Produits en Vedette</h2>
          </div>
          <Link href="/catalogue" className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition">
            <span>Catalogue complet</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-slate-50 rounded-3xl overflow-hidden hover:shadow-xl transition flex flex-col group">
              <div className="relative h-56 overflow-hidden bg-white">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${product.status === 'available'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                    }`}>
                    {product.status === 'available' ? 'Disponible' : 'Indisponible'}
                  </span>
                </div>
                {/*<div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-md text-slate-900 px-3 py-1 rounded-xl text-xs font-mono font-bold shadow-xs">
                    {product.brand}
                  </span>
                </div>*/}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{product.domain}</span>
                  <Link href={`/catalogue/${product.id}`}>
                    <h3 className="font-bold text-slate-900 text-base mt-1 hover:text-blue-600 transition line-clamp-1">{product.name}</h3>
                  </Link>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{product.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Tarif</span>
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
                    <span className="text-xs text-rose-600 font-semibold">Rupture</span>
                  )*/}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Stats Section */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
          <div className="space-y-2">
            <div className="text-4xl font-black text-slate-900">58 Wilayas</div>
            <div className="text-sm text-slate-500 font-medium">Couverture logistique nationale</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-black text-slate-900">&lt; 1 min</div>
            <div className="text-sm text-slate-500 font-medium">Mise à jour des stocks en temps réel</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-black text-slate-900">24 / 7</div>
            <div className="text-sm text-slate-500 font-medium">Support technique & SAV qualifié</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-black text-slate-900">100%</div>
            <div className="text-sm text-slate-500 font-medium">Conforme normes et traçabilité</div>
          </div>
        </div>
      </section>
    </div>
  );
}
