import { useState } from 'react';
import { BondForm } from './BondForm';
import { ResultsSummary } from './ResultsSummary';
import { CashFlowTable } from './CashFlowTable';
import { calculateBond } from '../services/bondApi';
import type { BondInput, BondResult } from '../types/bond.types';

export function BondCalculator() {
  const [results, setResults] = useState<BondResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (inputs: BondInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await calculateBond(inputs);
      setResults(data);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string | string[] } } })
              .response?.data?.message
          : null;
      const msg = Array.isArray(message)
        ? message.join(', ')
        : typeof message === 'string'
          ? message
          : 'Failed to calculate bond yield. Please check your inputs.';
      setError(msg);
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Input Parameters
          </h2>
          <BondForm onSubmit={handleSubmit} isLoading={isLoading} />
        </section>

        <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Results</h2>
          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          {results ? (
            <ResultsSummary results={results} />
          ) : (
            <p className="text-slate-500 text-sm">
              Enter bond parameters and click Calculate to see results.
            </p>
          )}
        </section>
      </div>

      {results && results.cashFlows.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">
            Cash Flow Schedule
          </h2>
          <CashFlowTable cashFlows={results.cashFlows} />
        </section>
      )}
    </>
  );
}
