import { useState, FormEvent } from 'react';
import type { BondInput, BondFrequency } from '../types/bond.types';

interface BondFormProps {
  onSubmit: (inputs: BondInput) => void;
  isLoading: boolean;
}

const initialValues: BondInput = {
  faceValue: 1000,
  couponRate: 8,
  marketPrice: 950,
  yearsToMaturity: 5,
  frequency: 'semi-annual',
};

export function BondForm({ onSubmit, isLoading }: BondFormProps) {
  const [inputs, setInputs] = useState<BondInput>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof BondInput, string>>>(
    {},
  );

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BondInput, string>> = {};

    if (inputs.faceValue < 1) {
      newErrors.faceValue = 'Face value must be at least 1';
    }
    if (inputs.couponRate < 0 || inputs.couponRate > 100) {
      newErrors.couponRate = 'Coupon rate must be between 0 and 100';
    }
    if (inputs.marketPrice < 1) {
      newErrors.marketPrice = 'Market price must be at least 1';
    }
    if (inputs.yearsToMaturity < 1 || !Number.isInteger(inputs.yearsToMaturity)) {
      newErrors.yearsToMaturity = 'Years to maturity must be an integer ≥ 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate() && !isLoading) {
      onSubmit(inputs);
    }
  };

  const handleChange = (
    field: keyof BondInput,
    value: number | BondFrequency,
  ) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="faceValue"
          className="block text-sm font-medium text-slate-300 mb-1"
        >
          Face Value ($)
        </label>
        <input
          id="faceValue"
          type="number"
          min={1}
          step={1}
          value={inputs.faceValue}
          onChange={(e) => handleChange('faceValue', Number(e.target.value))}
          className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
        {errors.faceValue && (
          <p className="mt-1 text-sm text-red-400">{errors.faceValue}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="couponRate"
          className="block text-sm font-medium text-slate-300 mb-1"
        >
          Annual Coupon Rate (%)
        </label>
        <input
          id="couponRate"
          type="number"
          min={0}
          max={100}
          step={0.01}
          value={inputs.couponRate}
          onChange={(e) => handleChange('couponRate', Number(e.target.value))}
          className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
        {errors.couponRate && (
          <p className="mt-1 text-sm text-red-400">{errors.couponRate}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="marketPrice"
          className="block text-sm font-medium text-slate-300 mb-1"
        >
          Market Price ($)
        </label>
        <input
          id="marketPrice"
          type="number"
          min={1}
          step={1}
          value={inputs.marketPrice}
          onChange={(e) => handleChange('marketPrice', Number(e.target.value))}
          className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
        {errors.marketPrice && (
          <p className="mt-1 text-sm text-red-400">{errors.marketPrice}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="yearsToMaturity"
          className="block text-sm font-medium text-slate-300 mb-1"
        >
          Years to Maturity
        </label>
        <input
          id="yearsToMaturity"
          type="number"
          min={1}
          step={1}
          value={inputs.yearsToMaturity}
          onChange={(e) =>
            handleChange('yearsToMaturity', Math.floor(Number(e.target.value)))
          }
          className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
        {errors.yearsToMaturity && (
          <p className="mt-1 text-sm text-red-400">
            {errors.yearsToMaturity}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Coupon Frequency
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleChange('frequency', 'annual')}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-colors ${
              inputs.frequency === 'annual'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
            }`}
          >
            Annual
          </button>
          <button
            type="button"
            onClick={() => handleChange('frequency', 'semi-annual')}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-colors ${
              inputs.frequency === 'semi-annual'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
            }`}
          >
            Semi-Annual
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-teal-500 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        {isLoading ? 'Calculating...' : 'Calculate'}
      </button>
    </form>
  );
}
