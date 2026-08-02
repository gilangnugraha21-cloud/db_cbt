import React from 'react';
import { QuestionType } from '../../types/cbt';

interface Props {
  type: QuestionType;
}

export const QuestionTypeBadge: React.FC<Props> = ({ type }) => {
  switch (type) {
    case 'pilihan_ganda':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
          Pilihan Ganda
        </span>
      );
    case 'pilihan_ganda_kompleks':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
          PG Kompleks (Checkbox)
        </span>
      );
    case 'benar_salah':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          Benar / Salah
        </span>
      );
    case 'menjodohkan':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
          Menjodohkan (Matching)
        </span>
      );
    case 'isian_singkat':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          Isian Singkat
        </span>
      );
    case 'esai':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
          Esai / Uraian
        </span>
      );
    default:
      return null;
  }
};
