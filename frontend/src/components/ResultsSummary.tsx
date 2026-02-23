import type { BondResult } from '../types/bond.types';

interface ResultsSummaryProps {
  results: BondResult;
}

const statusStyles: Record<
  BondResult['status'],
  { bg: string; border: string; label: string }
> = {
  PREMIUM: {
    bg: 'bg-amber-500/20',
    border: 'border-t-amber-500',
    label: 'Trading Above Face Value',
  },
  DISCOUNT: {
    bg: 'bg-emerald-500/20',
    border: 'border-t-emerald-500',
    label: 'Trading Below Face Value',
  },
  PAR: {
    bg: 'bg-blue-500/20',
    border: 'border-t-blue-500',
    label: 'Trading at Par',
  },
};

function formatCurrency(value: number): string {
  const sign = value >= 0 ? '' : '-';
  return `${sign}$${Math.abs(value).toFixed(2)}`;
}

export function ResultsSummary({ results }: ResultsSummaryProps) {
  const statusStyle = statusStyles[results.status];

  return (
    <div className="grid grid-cols-2 gap-4 animate-in">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 border-t-4 border-t-teal-500">
        <p className="text-sm text-slate-400 mb-1">Current Yield</p>
        <p className="text-2xl font-bold text-white tabular-nums">
          {results.currentYield}%
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 border-t-4 border-t-cyan-500">
        <p className="text-sm text-slate-400 mb-1">Yield to Maturity</p>
        <p className="text-2xl font-bold text-white tabular-nums">
          {results.ytm}%
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 border-t-4 border-t-violet-500">
        <p className="text-sm text-slate-400 mb-1">Total Interest Earned</p>
        <p className="text-2xl font-bold text-white tabular-nums">
          {formatCurrency(results.totalInterest)}
        </p>
      </div>

      <div
        className={`${statusStyle.bg} backdrop-blur-sm border border-white/10 rounded-xl p-4 border-t-4 ${statusStyle.border}`}
      >
        <p className="text-sm text-slate-400 mb-1">{statusStyle.label}</p>
        <p className="text-xl font-bold text-white tabular-nums">
          {results.status}
        </p>
        <p className="text-sm text-slate-300 mt-1">
          {formatCurrency(results.difference)}
        </p>
      </div>
    </div>
  );
}
