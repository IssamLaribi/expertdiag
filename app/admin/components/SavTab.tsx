'use client';

import React from 'react';
import type { ProblemStatus } from '@/types';
import { AppState } from '../constants';
import { SectionTitle, Empty } from './AdminUI';
import { ProblemCard } from './ProblemCard';

export function SavTab({
  problems,
  onSaveProblem,
}: {
  problems: AppState['problems'];
  onSaveProblem: (prob: AppState['problems'][number], status: ProblemStatus, date: string, msg: string, note: string) => void;
}) {
  return (
    <div className="space-y-5">
      <SectionTitle title="Service après-vente" />
      {problems.length === 0 ? (
        <Empty message="Aucun rapport SAV pour le moment." />
      ) : (
        <div className="grid gap-4">
          {problems.map((prob) => (
            <ProblemCard
              key={prob.id}
              prob={prob}
              onSave={(status, date, msg, note) => onSaveProblem(prob, status, date, msg, note)}
            />
          ))}
        </div>
      )}
    </div>
  );
}