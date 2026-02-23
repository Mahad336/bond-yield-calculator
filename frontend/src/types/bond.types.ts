export type BondFrequency = 'annual' | 'semi-annual';

export interface BondInput {
  faceValue: number;
  couponRate: number;
  marketPrice: number;
  yearsToMaturity: number;
  frequency: BondFrequency;
}

export type BondStatus = 'PREMIUM' | 'DISCOUNT' | 'PAR';

export interface CashFlow {
  period: number;
  date: string;
  coupon: number;
  cumulative: number;
  principal: number;
  faceReturned?: number;
}

export interface BondResult {
  currentYield: number;
  ytm: number;
  totalInterest: number;
  status: BondStatus;
  difference: number;
  cashFlows: CashFlow[];
}
