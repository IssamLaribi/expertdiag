'use client';

import React, { useState } from 'react';
import type { ProblemStatus } from '@/types';
import {
  AppState,
  PROBLEM_STATUSES,
  INPUT,
  BTN_PRIMARY,
  BTN_SUCCESS,
  BTN_GHOST,
  statusTone,
  labelOf,
} from '../constants';
import { Field } from './AdminUI';

export function ProblemCard({
  prob,
  onSave,
}: {
  prob: AppState['problems'][number];
  onSave: (status: ProblemStatus, date: string, msg: string, note: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<ProblemStatus>(prob.status);
  const [date, setDate] = useState(prob.plannedInterventionDate || '');
  const [msg, setMsg] = useState(prob.messageToCustomer || '');
  const [note, setNote] = useState(prob.internalNote || '');

  const statuses = PROBLEM_STATUSES.some((s) => s.value === prob.status)
    ? PROBLEM_STATUSES
    : [...PROBLEM_STATUSES, { value: prob.status, label: prob.status }];

  const open = () => {
    setStatus(prob.status);
    setDate(prob.plannedInterventionDate || '');
    setMsg(prob.messageToCustomer || '');
    setNote(prob.internalNote || '');
    setEditing(true);
  };

  return (
    <article className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono font-bold text-blue-600 text-base">{prob.reference}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusTone(prob.status)}`}>{labelOf(PROBLEM_STATUSES, prob.status)}</span>
          {prob.urgency === 'urgent' && <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full">Urgent</span>}
          <span className="text-sm font-bold text-slate-900">{prob.laboratoryName}</span>
        </div>
        {!editing && <button onClick={open} className={BTN_PRIMARY}>Traiter / Mettre à jour</button>}
      </div>

      <div>
        <p className="text-sm font-bold text-slate-900">
          {prob.equipmentName}
          {prob.serialNumber && <span className="font-mono text-slate-500 font-medium"> · S/N {prob.serialNumber}</span>}
        </p>
        <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl mt-3 leading-relaxed">{prob.description}</p>
      </div>

      {editing ? (
        <div className="p-6 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Statut">
              <select className={INPUT} value={status} onChange={(e) => setStatus(e.target.value as ProblemStatus)}>
                {statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </Field>
            <Field label="Intervention planifiée">
              <input className={INPUT} value={date} onChange={(e) => setDate(e.target.value)} placeholder="Ex : 2026-11-15 10:00" />
            </Field>
          </div>
          <Field label="Message visible par le client">
            <textarea className={`${INPUT} resize-none`} rows={2} value={msg} onChange={(e) => setMsg(e.target.value)} />
          </Field>
          <Field label="Note interne" hint="Visible par l’administration uniquement.">
            <input className={INPUT} value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
          <div className="flex gap-3">
            <button
              onClick={() => {
                onSave(status, date, msg, note);
                setEditing(false);
              }}
              className={BTN_SUCCESS}
            >
              Enregistrer
            </button>
            <button onClick={() => setEditing(false)} className={BTN_GHOST}>Annuler</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-purple-50 text-purple-900 rounded-2xl">
            <strong className="block text-[11px] uppercase tracking-wider opacity-70 mb-1">Intervention</strong>
            {prob.plannedInterventionDate || 'Non planifiée'}
          </div>
          <div className="p-4 bg-blue-50 text-blue-900 rounded-2xl">
            <strong className="block text-[11px] uppercase tracking-wider opacity-70 mb-1">Message client</strong>
            {prob.messageToCustomer || 'Aucun message'}
          </div>
          <div className="p-4 bg-slate-100 text-slate-800 rounded-2xl">
            <strong className="block text-[11px] uppercase tracking-wider opacity-70 mb-1">Note interne</strong>
            {prob.internalNote || '—'}
          </div>
        </div>
      )}
    </article>
  );
}