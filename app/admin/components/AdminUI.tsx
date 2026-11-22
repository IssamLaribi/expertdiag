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
      <label className="block text-sm font-medium">
        {label}
        {required && <span className="text-signal" aria-hidden="true"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-mute">{hint}</p>}
      {error && <p className="text-xs font-medium text-signal">{error}</p>}
    </div>
  );
}

export function SectionTitle({ title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="headline text-[1.6rem] leading-tight">{title}</h2>
      {action}
    </div>
  );
}

export function Empty({ message }: { message: string }) {
  return <p className="rounded-2xl border border-dashed border-line-strong bg-white px-6 py-14 text-center text-sm text-mute">{message}</p>;
}

/** One cell of the figures ledger on the summary tab. */
export function StatCard({
  label,
  value,
  hint,
  alert = false,
}: {
  label: string;
  value: number | string;
  hint?: string;
  alert?: boolean;
  tone?: 'blue' | 'amber' | 'rose' | 'emerald' | 'slate';
}) {
  return (
    <div className="card p-5">
      <p className="text-sm font-medium text-mute">{label}</p>
      <p className="headline mt-2 text-[2.25rem] leading-none tabular-nums">{value}</p>
      {hint && <p className={`mt-2 text-xs ${alert ? 'font-semibold text-signal' : 'text-mute'}`}>{hint}</p>}
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
      className={`m-auto w-[calc(100%-2rem)] max-h-[calc(100dvh-2rem)] overflow-auto rounded-2xl bg-white p-0 text-ink shadow-[0_30px_80px_-30px_rgb(7_22_52/0.6)] backdrop:bg-night/50 backdrop:backdrop-blur-[2px] ${maxWidth}`}
    >
      <div>
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-8">
          <h3 id={titleId} className="headline text-xl leading-tight">{title}</h3>
          <button type="button" onClick={onClose} aria-label="Fermer" className="grid size-10 place-items-center rounded-full bg-paper text-ink/70 hover:bg-paper-deep hover:text-ink">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
