'use client';

import React, { useState } from 'react';
import type { ProblemStatus } from '@/types';
import {
  AppState,
  PROBLEM_STATUSES,
  INPUT,
  BTN_PRIMARY,
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
    <article className="card space-y-4 p-5 sm:p-6">
      <header className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div className="space-y-1">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h3 className="text-lg font-bold tracking-wide tabular-nums">{prob.reference}</h3>
            {prob.urgency === 'urgent' && <span className="rounded-full bg-signal px-2 py-0.5 text-[0.6875rem] font-semibold text-white">Urgent</span>}
            <span className={`tag ${statusTone(prob.status)}`}>{labelOf(PROBLEM_STATUSES, prob.status)}</span>
          </div>
          <p className="text-sm">
            <span className="font-semibold">{prob.laboratoryName}</span>
            <span className="text-mute"> · {prob.equipmentName}</span>
            {prob.serialNumber && <span className="ref text-mute"> · S/N {prob.serialNumber}</span>}
          </p>
        </div>
        {!editing && <button type="button" onClick={open} className={`${BTN_GHOST} shrink-0`}>Mettre à jour</button>}
      </header>

      <p className="rounded-xl bg-paper px-4 py-3 text-sm leading-relaxed">{prob.description}</p>

      {editing ? (
        <div className="space-y-5 rounded-xl border border-line p-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Statut">
              <select className={INPUT} value={status} onChange={(e) => setStatus(e.target.value as ProblemStatus)}>
                {statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </Field>
            <Field label="Intervention planifiée">
              <input className={INPUT} value={date} onChange={(e) => setDate(e.target.value)} placeholder="2026-11-15 10:00" />
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
              type="button"
              onClick={() => {
                onSave(status, date, msg, note);
                setEditing(false);
              }}
              className={BTN_PRIMARY}
            >
              Enregistrer
            </button>
            <button type="button" onClick={() => setEditing(false)} className={BTN_GHOST}>Annuler</button>
          </div>
        </div>
      ) : (
        <dl className="grid gap-x-6 gap-y-3 text-sm md:grid-cols-3">
          <div>
            <dt className="text-xs text-mute">Intervention</dt>
            <dd className={`mt-0.5 ${prob.plannedInterventionDate ? 'font-medium tabular-nums' : 'text-mute'}`}>{prob.plannedInterventionDate || 'Non planifiée'}</dd>
          </div>
          <div>
            <dt className="text-xs text-mute">Message au client</dt>
            <dd className={`mt-0.5 ${prob.messageToCustomer ? '' : 'text-mute'}`}>{prob.messageToCustomer || 'Aucun message'}</dd>
          </div>
          <div>
            <dt className="text-xs text-mute">Note interne</dt>
            <dd className={`mt-0.5 ${prob.internalNote ? '' : 'text-mute'}`}>{prob.internalNote || '—'}</dd>
          </div>
        </dl>
      )}
    </article>
  );
}
