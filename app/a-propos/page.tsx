'use client';

import React from 'react';
import Link from 'next/link';
import {
  Microscope,
  ShieldCheck,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

const CONTAINER = 'max-w-[1760px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-20';
const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2';

const ABOUT_IMAGE =
  'https://img.magnific.com/premium-photo/closeup-scientific-equipment-including-centrifuges-modern-laboratory-setting_1218113-1335.jpg?semt=ais_hybrid&w=1400&q=80';

const PILLARS = [
  {
    icon: Microscope,
    title: 'Équipements de pointe',
    text: 'Partenaire officiel des plus grands fabricants mondiaux, nous garantissons des analyseurs robustes et précis.',
  },
  {
    icon: ShieldCheck,
    title: 'Service après-vente (SAV)',
    text: "Notre équipe d'ingénieurs biomédicaux assure la maintenance préventive et curative, l'étalonnage et le dépannage rapide sur tout le territoire national.",
  },
  {
    icon: Users,
    title: 'Proximité & expertise',
    text: 'Une présence logistique active couvrant les 58 wilayas pour assurer un approvisionnement continu en réactifs et consommables essentiels.',
  },
];

const STATS = [
  { value: '58 Wilayas', label: 'Couverture logistique nationale', accent: true },
  { value: '24 / 7', label: 'Support technique & SAV qualifié', accent: false },
  { value: '100%', label: 'Garantie conformité & traçabilité', accent: true },
];

const PARTNERS = ['Mindray', 'Sysmex', 'Roche', 'Abbott'];

const COMMITMENTS = [
  'Équipements et réactifs certifiés',
  'Maintenance préventive et curative',
  'Étalonnage et dépannage rapide',
  'Approvisionnement continu sur tout le territoire',
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function AboutPage() {
  return (
    <div className="bg-white selection:bg-blue-600 selection:text-white">
      {/* ---------------------------------- Hero --------------------------------- */}
      <section className="relative bg-slate-50 overflow-hidden lg:min-h-[520px] flex flex-col lg:flex-row lg:items-center">
        <div className="absolute inset-0 pointer-events-none opacity-60 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] [background-size:48px_48px]" />

        <div className="relative h-64 sm:h-80 lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[55%] order-first">
          <img src={ABOUT_IMAGE} alt="Laboratoire d'analyses médicales" className="absolute inset-0 w-full h-full object-cover object-right" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 from-[2%] via-slate-50/40 via-[35%] to-transparent to-[75%] lg:bg-gradient-to-r lg:from-slate-50 lg:from-[3%] lg:via-slate-50/75 lg:via-[28%] lg:to-transparent lg:to-[78%]" />
        </div>

        <div className={`${CONTAINER} relative z-10 w-full py-12 lg:py-24`}>
          <div className="lg:w-1/2 lg:pr-12 space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[2px] bg-blue-600" />
              <span className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em]">À propos</span>
            </div>
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tighter text-slate-900 leading-[1.05]">
              Le partenaire de référence de la <span className="text-blue-600">biologie en Algérie.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Depuis notre création, Expert Diagnostic s'engage aux côtés des laboratoires d'analyses médicales, des hôpitaux et des centres de recherche en fournissant des équipements de pointe, des réactifs certifiés et un support technique irréprochable.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------- Stats -------------------------------- */}
      <section className="bg-slate-900 text-white py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
        <dl className={`${CONTAINER} grid grid-cols-1 sm:grid-cols-3 gap-y-10 text-center relative z-10`}>
          {STATS.map((stat, i) => (
            <div key={stat.label} className={`space-y-2 px-4 ${i > 0 ? 'sm:border-l sm:border-slate-800' : ''}`}>
              <dt className={`text-4xl lg:text-5xl font-black ${stat.accent ? 'text-blue-400' : 'text-white'}`}>{stat.value}</dt>
              <dd className="text-sm text-slate-400 font-medium tracking-wide">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* --------------------------------- Pillars ------------------------------- */}
      <section className={`${CONTAINER} py-24`}>
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-[2px] bg-blue-600" />
            <span className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em]">Nos engagements</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Ce qui nous <span className="text-blue-600">distingue.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PILLARS.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 space-y-5"
            >
              <span className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
                <Icon className="w-6 h-6" />
              </span>
              <h3 className="text-xl font-bold text-slate-900">{title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* --------------------------- Partners & commitments ---------------------- */}
      <section className="bg-slate-50/70 border-y border-slate-200/60 py-24">
        <div className={`${CONTAINER} grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center`}>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[2px] bg-blue-600" />
              <span className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em]">Nos partenaires</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Les plus grands fabricants, <span className="text-blue-600">à votre service.</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
              Notre statut de partenaire officiel nous donne accès aux dernières technologies de diagnostic et à un support constructeur de premier niveau.
            </p>
            <ul className="grid grid-cols-2 gap-4 max-w-md pt-2">
              {PARTNERS.map((p) => (
                <li key={p} className="bg-white border border-slate-200 rounded-2xl px-5 py-4 text-center text-lg font-extrabold text-slate-900 tracking-tight shadow-sm">
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <ul className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm space-y-5">
            {COMMITMENTS.map((item) => (
              <li key={item} className="flex items-start gap-3.5 text-sm sm:text-base text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}