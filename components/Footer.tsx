'tsx'
'use client';

import React from 'react';
import Link from 'next/link';
import { Microscope, Phone, Mail, MapPin, ShieldCheck, Clock, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-slate-600 pt-16 pb-12 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Company Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Microscope className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Expert Diagnostic</span>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Fournisseur leader en Algérie d'équipements de biologie médicale, réactifs de diagnostic in vitro et consommables de laboratoire.
          </p>
          <div className="text-xs text-slate-400 pt-2 font-medium">
            Conforme à la protection des données (Loi 18-07).
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-4">Navigation</h3>
          <ul className="space-y-2.5 text-sm font-medium">
            <li><Link href="/" className="hover:text-blue-600 transition">Accueil</Link></li>
            <li><Link href="/catalogue" className="hover:text-blue-600 transition">Catalogue des Produits</Link></li>
            <li><Link href="/a-propos" className="hover:text-blue-600 transition">À Propos de l'Entreprise</Link></li>
            <li><Link href="/contact" className="hover:text-blue-600 transition">Nous Contacter</Link></li>
            <li>
              <Link href="/admin" className="text-blue-600 hover:text-blue-700 font-bold transition flex items-center gap-1.5 pt-1">
                <Shield className="w-3.5 h-3.5" />
                <span>Espace Administration (Back-Office)</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Specialties / Domains */}
        <div>
          <h3 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-4">Domaines Analytiques</h3>
          <ul className="space-y-2.5 text-sm text-slate-500">
            <li>Biochimie Clinique</li>
            <li>Hématologie & Cytométrie</li>
            <li>Immunologie & Sérologie</li>
            <li>Microbiologie & Bactériologie</li>
            <li>Urinalyse Automatisée</li>
          </ul>
        </div>

        {/* Contact Info (FR-34) */}
        <div>
          <h3 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-4">Contact & Siège</h3>
          <ul className="space-y-3 text-sm text-slate-500">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-1" />
              <span>Zone Industrielle, Oued Smar, Alger, Algérie</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-blue-600 shrink-0" />
              <a href="tel:+21323456789" className="hover:text-blue-600 transition font-medium">+213 (0) 23 45 67 89</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-blue-600 shrink-0" />
              <a href="mailto:contact@expert-diagnostic.dz" className="hover:text-blue-600 transition font-medium">contact@expert-diagnostic.dz</a>
            </li>
            <li className="flex items-center gap-2.5 pt-2">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs text-emerald-700 font-semibold">Support technique : Dim - Jeudi (8h - 17h)</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-8 border-t border-slate-100 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          © 2026 Expert Diagnostic S.R.L. Tous droits réservés. Développé pour la biologie médicale algérienne.
        </div>
        <div className="flex items-center gap-6 font-medium">
          <span className="flex items-center gap-1.5 text-blue-600">
            <ShieldCheck className="w-4 h-4" />
            Sécurisé HTTPS
          </span>
          <span>Version 1.0 (Release 1)</span>
        </div>
      </div>
    </footer>
  );
};
