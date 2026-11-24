'use client';

import React from 'react';
import Image from 'next/image';
import { INPUT, BTN_PRIMARY } from '../constants';
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
    <div className="site-width grid items-center gap-10 py-12 sm:py-20 md:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] md:gap-16">
      <div>
        <Image src="/art/backoffice.webp" alt="" width={260} height={260} unoptimized className="mb-4 size-52 sm:size-60" />
        <p className="text-sm text-mute">Réservé à l’équipe Expert Diagnostic</p>
        <h1 className="page-title mt-2">Administration</h1>
        <p className="mt-4 max-w-md leading-relaxed text-mute">
          Catalogue et stock, demandes de devis, dossiers de service après-vente.
        </p>
      </div>

      <form onSubmit={onLogin} className="card space-y-5 p-6 shadow-[0_24px_60px_-30px_rgb(7_22_52/0.35)] sm:p-8">
        <h2 className="headline text-xl">Connexion</h2>
        <Field label="Adresse e-mail">
          <input type="email" required autoComplete="username" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className={INPUT} />
        </Field>

        <Field label="Mot de passe">
          <input type="password" required autoComplete="current-password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className={INPUT} />
        </Field>

        {loginError && (
          <p role="alert" className="rounded-lg bg-signal/8 px-3.5 py-2.5 text-sm text-signal">
            Identifiants incorrects. Veuillez réessayer.
          </p>
        )}

        <button type="submit" className={`${BTN_PRIMARY} min-h-12 w-full`}>Se connecter</button>

        <p className="border-t border-line pt-4 text-sm text-mute">
          Version de démonstration&nbsp;:{' '}
          <button type="button" onClick={onDemoLogin} className="font-semibold text-brand underline-offset-4 hover:underline">
            entrer sans identifiants
          </button>
        </p>
      </form>
    </div>
  );
}
