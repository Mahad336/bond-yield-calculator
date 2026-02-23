import { FrequencyStrategy } from '../types/bond.types';

export class AnnualStrategy implements FrequencyStrategy {
  getPeriodsPerYear(): number {
    return 1;
  }

  getCouponPerPeriod(faceValue: number, rate: number): number {
    return faceValue * (rate / 100);
  }

  getMonthsPerPeriod(): number {
    return 12;
  }
}

export class SemiAnnualStrategy implements FrequencyStrategy {
  getPeriodsPerYear(): number {
    return 2;
  }

  getCouponPerPeriod(faceValue: number, rate: number): number {
    return (faceValue * (rate / 100)) / 2;
  }

  getMonthsPerPeriod(): number {
    return 6;
  }
}
