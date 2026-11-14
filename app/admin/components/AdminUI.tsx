'use client';

import React, { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';

export function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="w-8 h-[2px] bg-blue-600" />
          <span className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em]">{eyebrow}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function Empty({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-14 text-center text-sm text-slate-500">
      {message}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = 'blue',
}: {
  label: string;
  value: number | string;
  hint?: string;
  tone?: 'blue' | 'amber' | 'rose' | 'emerald' | 'slate';
}) {
  const tones = {
    blue: 'text-blue-600',
    amber: 'text-amber-600',
    rose: 'text-rose-600',
    emerald: 'text-emerald-600',
    slate: 'text-slate-900',
  };
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className={`text-4xl font-black mt-2 ${tones[tone]}`}>{value}</p>
      {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
    </div>
  );
}

export function Modal({
  title,
  onClose,
  maxWidth = 'max-w-4xl',
  children,
}: {
  title: string;
  onClose: () => void;
  maxWidth?: string;
  children: React.ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      className={`m-auto w-[calc(100%-2rem)] max-h-dvh overflow-auto rounded-lg border border-line bg-white p-0 text-ink backdrop:bg-slate-950/45 ${maxWidth}`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 border-b border-line p-5 sm:px-8">
          <h3 id={titleId} className="text-xl font-semibold">{title}</h3>
          <button type="button" onClick={onClose} aria-label="Fermer" className="button-secondary min-w-11 px-0">
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
