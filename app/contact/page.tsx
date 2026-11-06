'tsx'
'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', lab: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
          Contactez-nous
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900">Une question, un devis ou un besoin SAV ?</h1>
        <p className="text-sm text-slate-600">Notre équipe commerciale et technique vous répond dans les plus brefs délais.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact info cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Coordonnées Officielles</h3>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Siège Social & Showroom</h4>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">Zone Industrielle, Oued Smar, Alger, Algérie</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Téléphone / Fax</h4>
                <a href="tel:+21323456789" className="text-sm font-semibold text-blue-600 hover:underline mt-0.5 block">+213 (0) 23 45 67 89</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Adresse e-mail</h4>
                <a href="mailto:contact@expert-diagnostic.dz" className="text-sm font-semibold text-blue-600 hover:underline mt-0.5 block">contact@expert-diagnostic.dz</a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          {submitted ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Message Envoyé avec Succès !</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Merci pour votre message. Un accusé de réception vous a été envoyé et notre équipe commerciale vous contactera rapidement.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium text-sm shadow-md"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900">Formulaire de Contact (Sans connexion requis)</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nom / Contact</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full text-sm border border-slate-300 rounded-xl p-3 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Dr. Nom Prénom"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Laboratoire / Établissement</label>
                  <input
                    type="text"
                    required
                    value={formData.lab}
                    onChange={e => setFormData({...formData, lab: e.target.value})}
                    className="w-full text-sm border border-slate-300 rounded-xl p-3 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Laboratoire d'analyses..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Adresse e-mail</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full text-sm border border-slate-300 rounded-xl p-3 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="contact@labo.dz"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full text-sm border border-slate-300 rounded-xl p-3 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="+213..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Votre Message / Demande</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full text-sm border border-slate-300 rounded-xl p-3 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Précisez votre besoin en réactifs, analyseurs ou maintenance SAV..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Envoyer le Message</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
