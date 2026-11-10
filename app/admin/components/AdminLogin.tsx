'use client';

import React from 'react';
import { Shield, Lock, Mail, ArrowUpRight } from 'lucide-react';
import { INPUT, BTN_PRIMARY, FOCUS } from '../constants';
import { Field } from './AdminUI';

export function AdminLogin({
  adminEmail,
  setAdminEmail,
  adminPassword,
  setAdminPassword,
  loginError,
  onLogin,
  onDemoLogin,
}: {
  adminEmail: string;
  setAdminEmail: (v: string) => void;
  adminPassword: string;
  setAdminPassword: (v: string) => void;
  loginError: boolean;
  onLogin: (e: React.FormEvent) => void;
  onDemoLogin: () => void;
}) {
  return (
    <div className="bg-slate-50/70 min-h-[calc(100svh-6rem)] flex items-center">
      <div className="w-full max-w-xl mx-auto px-6 py-20">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-8">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Espace Administration</h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Connexion sécurisée réservée au personnel autorisé d’Expert Diagnostic.
            </p>
          </div>

          <form onSubmit={onLogin} className="space-y-5">
            <Field label="Adresse e-mail admin">
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input type="email" required value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className={`${INPUT} pl-10`} />
              </div>
            </Field>

            <Field label="Mot de passe">
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input type="password" required value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className={`${INPUT} pl-10`} />
              </div>
            </Field>

            {loginError && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl font-medium">
                Identifiants incorrects. Veuillez réessayer.
              </div>
            )}

            <button type="submit" className={`${BTN_PRIMARY} w-full py-4`}>
              <span>Se connecter au Back-Office</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-1">
              <button type="button" onClick={onDemoLogin} className={`text-xs font-bold text-blue-600 hover:text-blue-700 transition rounded ${FOCUS}`}>
                Accès rapide démo (connexion directe Admin) →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}