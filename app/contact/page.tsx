'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const CONTAINER = 'max-w-[1760px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-20';
const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2';

/* Input text is black, as on the admin forms */
const INPUT =
  'w-full text-sm text-black placeholder:text-slate-400 border border-slate-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition';

const CONTACT_ITEMS = [
  {
    icon: MapPin,
    label: 'Siège social & showroom',
    value: 'Kouba, Alger, Algérie',
  },
  {
    icon: Phone,
    label: 'Téléphone / Fax',
    value: '+213 (0) 23 45 67 89',
    href: 'tel:+21323456789',
  },
  {
    icon: Mail,
    label: 'Adresse e-mail',
    value: 'contact@expert-diagnostic.dz',
    href: 'mailto:contact@expert-diagnostic.dz',
  },
  {
    icon: Clock,
    label: 'Support technique',
    value: 'Dimanche - Jeudi (8h - 17h)',
  },
];

const SUBJECTS = [
  'Demande de devis',
  'Information produit',
  'Service après-vente (SAV)',
  'Partenariat',
  'Autre demande',
];

const EMPTY_FORM = { name: '', email: '', phone: '', lab: '', subject: SUBJECTS[0], message: '' };

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const update = (key: keyof typeof EMPTY_FORM, value: string) =>
    setFormData((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const reset = () => {
    setFormData(EMPTY_FORM);
    setSubmitted(false);
  };

  return (
    <div className="bg-white selection:bg-blue-600 selection:text-white">
      {/* ------------------------------ Page header ----------------------------- */}
      <section className="relative bg-slate-50 border-b border-slate-200/60 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-60 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />

        <div className={`${CONTAINER} relative py-16 lg:py-24`}>
          <div className="max-w-3xl space-y-5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[2px] bg-blue-600" />
              <span className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em]">Contactez-nous</span>
            </div>
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tighter text-slate-900 leading-[1.05]">
              Une question, un devis ou un <span className="text-blue-600">besoin SAV ?</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Notre équipe commerciale et technique vous répond dans les plus brefs délais.
            </p>
          </div>
        </div>
      </section>

      {/* --------------------------------- Content ------------------------------- */}
      <section className={`${CONTAINER} py-16 lg:py-24`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Contact details */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-32">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Coordonnées <span className="text-blue-600">officielles</span>
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Retrouvez-nous au siège ou joignez directement nos équipes.
              </p>
            </div>

            <ul className="bg-slate-50/70 border border-slate-200 rounded-3xl divide-y divide-slate-200">
              {CONTACT_ITEMS.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex items-start gap-4 p-6">
                  <span className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                    {href ? (
                      <a href={href} className={`text-sm font-semibold text-blue-600 hover:text-blue-800 transition mt-1 block rounded ${FOCUS}`}>
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-slate-900 mt-1">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
            {submitted ? (
              <div className="text-center py-16 space-y-5">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Message envoyé avec succès !</h3>
                <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
                  Merci pour votre message. Un accusé de réception vous a été envoyé et notre équipe commerciale vous contactera rapidement.
                </p>
                <button
                  onClick={reset}
                  className={`mt-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/25 transition ${FOCUS}`}
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Formulaire de contact</h2>
                  <p className="text-sm text-slate-500">Aucune connexion requise.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Nom / Contact</label>
                    <input id="name" type="text" required value={formData.name} onChange={(e) => update('name', e.target.value)} className={INPUT} placeholder="Dr. Nom Prénom" />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="lab" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Laboratoire / Établissement</label>
                    <input id="lab" type="text" required value={formData.lab} onChange={(e) => update('lab', e.target.value)} className={INPUT} placeholder="Laboratoire d'analyses..." />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Adresse e-mail</label>
                    <input id="email" type="email" required value={formData.email} onChange={(e) => update('email', e.target.value)} className={INPUT} placeholder="contact@labo.dz" />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Téléphone</label>
                    <input id="phone" type="tel" required value={formData.phone} onChange={(e) => update('phone', e.target.value)} className={INPUT} placeholder="+213..." />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="subject" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Objet de la demande</label>
                  <select id="subject" value={formData.subject} onChange={(e) => update('subject', e.target.value)} className={INPUT}>
                    {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Votre message / demande</label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => update('message', e.target.value)}
                    className={`${INPUT} resize-none`}
                    placeholder="Précisez votre besoin en réactifs, analyseurs ou maintenance SAV..."
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/25 transition flex items-center justify-center gap-2.5 ${FOCUS}`}
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer le message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}