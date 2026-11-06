'tsx'
'use client';

import React from 'react';
import { Microscope, ShieldCheck, Award, Users, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900">Le Partenaire de Référence de la Biologie en Algérie</h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Depuis notre création, Expert Diagnostic s'engage aux côtés des laboratoires d'analyses médicales, des hôpitaux et des centres de recherche en fournissant des équipements de pointe, des réactifs certifiés et un support technique irréprochable.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Microscope className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Équipements de Pointe</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Partenaire officiel des plus grands fabricants mondiaux (Mindray, Sysmex, Roche, Abbott), nous garantissons des analyseurs robustes et précis.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Service Après-Vente (SAV)</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Notre équipe d'ingénieurs biomédicaux assure la maintenance préventive et curative, l'étalonnage et le dépannage rapide sur tout le territoire national.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Proximité & Expertise</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Une présence logistique active couvrant les 58 wilayas pour assurer un approvisionnement continu en réactifs et consommables essentiels.
          </p>
        </div>
      </div>
    </div>
  );
}
