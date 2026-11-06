'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { 
  Search, 
  Microscope, 
  ShieldCheck, 
  Truck, 
  ArrowRight, 
  ArrowUpRight, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Award, 
  Sparkles, 
  Building2, 
  Clock 
} from 'lucide-react';

export default function HomePage() {
  const { products, domains, addToCart } = useApp();

  const featuredProducts = products.filter(p => p.visible).slice(0, 4);

  // Exemple de données pour les événements et expositions
  const exhibitions = [
    {
      id: 1,
      title: "SIMEM 2026 - Salon International de la Santé",
      location: "Centre des Conventions d'Oran (CCO)",
      date: "Mai 2026",
      type: "Exposition Majeure",
      image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=800&auto=format&fit=crop",
      description: "Présentation de nos dernières gammes d'automates de biochimie et d'immuno-analyse de dernière génération."
    },
    {
      id: 2,
      title: "Journées Nationales de Biologie Médicale",
      location: "Alger - Hôtel Sheraton",
      date: "Octobre 2026",
      type: "Congrès Scientifique",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
      description: "Échanges scientifiques autour des innovations en réactifs de diagnostic in vitro et contrôle qualité."
    },
    {
      id: 3,
      title: "Medica / Arab Health Preview & Partenariats",
      location: "Alger & International",
      date: "Continu 2026",
      type: "Veille & Networking",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop",
      description: "Renforcement de nos partenariats mondiaux pour garantir aux laboratoires algériens des technologies de pointe."
    }
  ];

  return (
    <div className="space-y-24 pb-28 bg-white selection:bg-blue-600 selection:text-white">
      
      {/* Section: HERO */}
      <section className="relative bg-gradient-to-b from-slate-50/80 via-white to-white pt-16 pb-24 px-6 sm:px-12 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-6 space-y-8">

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.08]">
              La précision commence par le bon <span className="text-blue-600">partenaire.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-normal">
              Réactifs de haute performance, analyseurs de pointe et consommables essentiels pour votre laboratoire. Accompagnés par une expertise technique certifiée.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/catalogue"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-3 group"
              >
                <span>Explorer le catalogue</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </Link>

              <Link
                href="/a-propos"
                className="px-6 py-4 bg-white border border-slate-200 text-slate-800 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition rounded-xl flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Découvrir Expert Diagnostic</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-1 border-white bg-slate-100 group">
              <img
                src="https://img.magnific.com/premium-photo/closeup-scientific-equipment-including-centrifuges-modern-laboratory-setting_1218113-1335.jpg?semt=ais_hybrid&w=740&q=80"
                alt="Laboratoire Clinique Automatisé"
                className="w-full h-[480px] object-cover group-hover:scale-105 transition duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section: TRUST & STATS SECTION */}
      <section className="bg-slate-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
        <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 text-center relative z-10">
          <div className="space-y-2 border-b md:border-b-0 md:border-r border-slate-800 pb-8 md:pb-0">
            <div className="text-4xl lg:text-5xl font-black text-blue-400">58 Wilayas</div>
            <div className="text-sm text-slate-400 font-medium tracking-wide">Couverture logistique nationale</div>
          </div>
          <div className="space-y-2 border-b md:border-b-0 md:border-r border-slate-800 pb-8 md:pb-0">
            <div className="text-4xl lg:text-5xl font-black text-white">&lt; 1 min</div>
            <div className="text-sm text-slate-400 font-medium tracking-wide">Mise à jour stocks en temps réel</div>
          </div>
          <div className="space-y-2 border-b md:border-b-0 md:border-r border-slate-800 pb-8 md:pb-0">
            <div className="text-4xl lg:text-5xl font-black text-blue-400">24 / 7</div>
            <div className="text-sm text-slate-400 font-medium tracking-wide">Support technique & SAV qualifié</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl lg:text-5xl font-black text-white">100%</div>
            <div className="text-sm text-slate-400 font-medium tracking-wide">Garantie conformité & traçabilité</div>
          </div>
        </div>
      </section>

      {/*Section: Participation in events and exhibitions */}
      <section className="bg-slate-50/70 border-y border-slate-200/60 py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 mb-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-[2px] bg-blue-600" />
                <span className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em]">
                  Présence sur le terrain
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Nos Participations aux <span className="text-blue-600">Événements & Congrès</span>
              </h2>
              <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
                Expert Diagnostic s'engage auprès de la communauté scientifique en participant activement aux plus grands salons médicaux et journées de biologie.
              </p>
            </div>

            <div className="hidden lg:flex items-center gap-2 bg-white px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 shadow-xs">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Retrouvez-nous lors de nos prochaines éditions</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {exhibitions.map((event) => (
              <div 
                key={event.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold rounded-full uppercase tracking-wider">
                      {event.type}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-blue-600 flex items-center gap-1.5 shadow-sm">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{event.date}</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{event.location}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                    <span className="flex items-center gap-1.5">
                      <Award className="w-4 h-4" />
                      Stand Expert Diagnostic
                    </span>
                    <span className="text-slate-400 group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Section: Specialty Domains */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-[2px] bg-blue-600" />
              <span className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em]">
                Spécialités analytiques
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Explorez nos domaines <span className="text-blue-600">de biologie médicale.</span>
            </h2>
            <p className="text-slate-500 mt-3 text-sm sm:text-base leading-relaxed">
              Des solutions complètes adaptées à chaque discipline de votre laboratoire.
            </p>
          </div>

          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition group shrink-0"
          >
            Explorer tout le catalogue
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {domains.map((dom) => (
            <Link
              key={dom.id}
              href={`/catalogue?domain=${encodeURIComponent(dom.name)}`}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white hover:shadow-xl hover:shadow-blue-900/10 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-40 sm:h-44 overflow-hidden bg-slate-100">
                <img
                  src={dom.image}
                  alt={dom.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-blue-600 opacity-0 group-hover:opacity-100 transition">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
                  {dom.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Équipements & réactifs
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      

      {/* Section: Products */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="flex justify-between items-end mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-[2px] bg-blue-600" />
              <span className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em]">
                Matériel haut de gamme
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Produits en Vedette</h2>
          </div>
          <Link href="/catalogue" className="hidden sm:flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition">
            <span>Catalogue complet</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-slate-50/80 border border-slate-200/80 rounded-3xl overflow-hidden hover:shadow-2xl hover:border-blue-200 transition-all duration-300 flex flex-col group">
              <div className="relative h-56 overflow-hidden bg-white">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-xs ${
                    product.status === 'available'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}>
                    {product.status === 'available' ? 'Disponible' : 'Indisponible'}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">{product.domain}</span>
                  <Link href={`/catalogue/${product.id}`}>
                    <h3 className="font-bold text-slate-900 text-base mt-1 hover:text-blue-600 transition line-clamp-1">{product.name}</h3>
                  </Link>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{product.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Tarif indicatif</span>
                    <span className="text-sm font-bold text-slate-900">{product.priceEstimate || 'Sur devis'}</span>
                  </div>
                  <Link 
                    href={`/catalogue/${product.id}`}
                    className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white font-semibold text-xs rounded-xl transition shadow-sm"
                  >
                    Détails
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. WHY CHOOSE US / VALUE PILLARS 
      <section className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-3">L'excellence au service de la santé</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Pourquoi les laboratoires nous font confiance</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Chaîne du Froid & Logistique Sécurisée</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Transport frigorifique certifié et livraison rapide sur l'ensemble du territoire national pour préserver l'intégrité de vos réactifs.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Support Technique & SAV Réactif</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Une équipe d'ingénieurs biomédicaux à votre écoute 24h/24 et 7j/7 pour la maintenance préventive et curative de vos automates.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Conformité & Traçabilité Totale</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Des produits certifiés répondant aux normes internationales les plus strictes pour garantir la fiabilité de vos diagnostics cliniques.
            </p>
          </div>
        </div>
      </section>*/}

      {/* 7. FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 rounded-3xl p-10 sm:p-16 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="px-3.5 py-1.5 rounded-full bg-blue-500/30 border border-blue-400/30 text-blue-200 text-xs font-bold uppercase tracking-widest">
              Prêt à équiper votre laboratoire ?
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Optimisez les performances de votre plateau technique dès aujourd'hui.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Contactez nos conseillers commerciaux pour recevoir un devis personnalisé ou planifier une démonstration de nos analyseurs.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/catalogue"
                className="px-8 py-4 bg-white text-slate-900 hover:bg-blue-50 font-bold text-sm rounded-xl shadow-lg transition flex items-center gap-2"
              >
                <span>Voir le catalogue</span>
                <ArrowRight className="w-4 h-4 text-blue-600" />
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg transition flex items-center gap-2"
              >
                <span>Nous contacter</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}