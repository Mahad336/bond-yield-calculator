import { Test, TestingModule } from '@nestjs/testing';
import { BondService } from '../src/bond/bond.service';
import { FrequencyStrategyFactory } from '../src/bond/strategies/frequency-strategy.factory';

describe('BondService', () => {
  let service: BondService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BondService, FrequencyStrategyFactory],
    }).compile();

    service = module.get<BondService>(BondService);
  });

  describe('Reference Example (Section 8)', () => {
    const referenceInput = {
      faceValue: 1000,
      couponRate: 8,
      marketPrice: 950,
      yearsToMaturity: 5,
      frequency: 'semi-annual' as const,
    };

    it('should compute current yield as 8.42%', () => {
      const result = service.calculate(referenceInput);
      expect(result.currentYield).toBe(8.42);
    });

    it('should compute YTM approximately 9.19%', () => {
      const result = service.calculate(referenceInput);
      expect(result.ytm).toBeGreaterThanOrEqual(9.1);
      expect(result.ytm).toBeLessThanOrEqual(9.3);
    });

    it('should compute total interest as $450.00', () => {
      const result = service.calculate(referenceInput);
      expect(result.totalInterest).toBe(450);
    });

    it('should return DISCOUNT status', () => {
      const result = service.calculate(referenceInput);
      expect(result.status).toBe('DISCOUNT');
    });

    it('should return difference of -50', () => {
      const result = service.calculate(referenceInput);
      expect(result.difference).toBe(-50);
    });

    it('should generate 10 cash flow periods', () => {
      const result = service.calculate(referenceInput);
      expect(result.cashFlows).toHaveLength(10);
    });

    it('should have coupon per period of $40.00', () => {
      const result = service.calculate(referenceInput);
      expect(result.cashFlows[0].coupon).toBe(40);
    });

    it('should have final cumulative of $400.00', () => {
      const result = service.calculate(referenceInput);
      const lastFlow = result.cashFlows[result.cashFlows.length - 1];
      expect(lastFlow.cumulative).toBe(400);
    });

    it('should return face value on final period', () => {
      const result = service.calculate(referenceInput);
      const lastFlow = result.cashFlows[result.cashFlows.length - 1];
      expect(lastFlow.faceReturned).toBe(1000);
    });
  });

  describe('Premium/Par status', () => {
    it('should return PREMIUM when market price > face value', () => {
      const result = service.calculate({
        faceValue: 1000,
        couponRate: 5,
        marketPrice: 1050,
        yearsToMaturity: 3,
        frequency: 'annual',
      });
      expect(result.status).toBe('PREMIUM');
      expect(result.difference).toBe(50);
    });

    it('should return PAR when market price = face value', () => {
      const result = service.calculate({
        faceValue: 1000,
        couponRate: 5,
        marketPrice: 1000,
        yearsToMaturity: 3,
        frequency: 'annual',
      });
      expect(result.status).toBe('PAR');
      expect(result.difference).toBe(0);
    });
  });

  describe('Annual frequency', () => {
    it('should generate correct number of periods for annual', () => {
      const result = service.calculate({
        faceValue: 1000,
        couponRate: 10,
        marketPrice: 1000,
        yearsToMaturity: 5,
        frequency: 'annual',
      });
      expect(result.cashFlows).toHaveLength(5);
      expect(result.cashFlows[0].coupon).toBe(100);
    });
  });
});
