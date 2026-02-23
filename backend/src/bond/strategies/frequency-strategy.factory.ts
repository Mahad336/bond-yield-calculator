import { Injectable } from '@nestjs/common';
import { FrequencyStrategy } from '../types/bond.types';
import { AnnualStrategy } from './frequency.strategy';
import { SemiAnnualStrategy } from './frequency.strategy';

export type BondFrequency = 'annual' | 'semi-annual';

@Injectable()
export class FrequencyStrategyFactory {
  getStrategy(frequency: BondFrequency): FrequencyStrategy {
    switch (frequency) {
      case 'semi-annual':
        return new SemiAnnualStrategy();
      case 'annual':
      default:
        return new AnnualStrategy();
    }
  }
}
