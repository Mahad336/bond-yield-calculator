import { Injectable } from '@nestjs/common';
import {
  BondResult,
  CashFlow,
  BondStatus,
  FrequencyStrategy,
} from './types/bond.types';
import { BondInputDto } from './dto/bond-input.dto';
import { FrequencyStrategyFactory } from './strategies/frequency-strategy.factory';

@Injectable()
export class BondService {
  private readonly YTM_TOLERANCE = 0.0001;
  private readonly YTM_MAX_ITERATIONS = 10000;

  constructor(private readonly strategyFactory: FrequencyStrategyFactory) {}

  calculate(dto: BondInputDto): BondResult {
    const strategy = this.strategyFactory.getStrategy(dto.frequency);

    const periodsPerYear = strategy.getPeriodsPerYear();
    const totalPeriods = dto.yearsToMaturity * periodsPerYear;
    const couponPerPeriod = strategy.getCouponPerPeriod(
      dto.faceValue,
      dto.couponRate,
    );
    const annualCoupon = dto.faceValue * (dto.couponRate / 100);

    const currentYield = this.calculateCurrentYield(
      annualCoupon,
      dto.marketPrice,
    );
    const ytm = this.calculateYTM(
      strategy,
      dto.faceValue,
      dto.marketPrice,
      totalPeriods,
      couponPerPeriod,
    );
    const { status, difference } = this.getPremiumDiscountStatus(
      dto.marketPrice,
      dto.faceValue,
    );
    const totalInterest = this.calculateTotalInterest(
      couponPerPeriod,
      totalPeriods,
      dto.faceValue,
      dto.marketPrice,
    );
    const cashFlows = this.generateCashFlows(
      strategy,
      dto.faceValue,
      dto.couponRate,
      dto.yearsToMaturity,
      couponPerPeriod,
    );

    return {
      currentYield: Math.round(currentYield * 100) / 100,
      ytm: Math.round(ytm * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      status,
      difference,
      cashFlows,
    };
  }

  private calculateCurrentYield(
    annualCoupon: number,
    marketPrice: number,
  ): number {
    return (annualCoupon / marketPrice) * 100;
  }

  private calculateYTM(
    strategy: FrequencyStrategy,
    faceValue: number,
    marketPrice: number,
    totalPeriods: number,
    couponPerPeriod: number,
  ): number {
    let low = 0.0001;
    let high = 1.0;

    for (let i = 0; i < this.YTM_MAX_ITERATIONS; i++) {
      const mid = (low + high) / 2;
      const calculatedPrice = this.calculatePresentValue(
        mid,
        totalPeriods,
        couponPerPeriod,
        faceValue,
      );

      const diff = Math.abs(calculatedPrice - marketPrice);
      if (diff < this.YTM_TOLERANCE) {
        const periodsPerYear = strategy.getPeriodsPerYear();
        return mid * periodsPerYear * 100;
      }

      if (calculatedPrice > marketPrice) {
        low = mid;
      } else {
        high = mid;
      }
    }

    const mid = (low + high) / 2;
    const periodsPerYear = strategy.getPeriodsPerYear();
    return mid * periodsPerYear * 100;
  }

  private calculatePresentValue(
    rate: number,
    periods: number,
    couponPerPeriod: number,
    faceValue: number,
  ): number {
    let pv = 0;

    for (let t = 1; t <= periods; t++) {
      pv += couponPerPeriod / Math.pow(1 + rate, t);
    }

    pv += faceValue / Math.pow(1 + rate, periods);
    return pv;
  }

  private getPremiumDiscountStatus(
    marketPrice: number,
    faceValue: number,
  ): { status: BondStatus; difference: number } {
    const difference = marketPrice - faceValue;

    if (difference > 0) {
      return { status: 'PREMIUM', difference };
    }
    if (difference < 0) {
      return { status: 'DISCOUNT', difference };
    }
    return { status: 'PAR', difference };
  }

  private calculateTotalInterest(
    couponPerPeriod: number,
    totalPeriods: number,
    faceValue: number,
    marketPrice: number,
  ): number {
    const totalCoupons = couponPerPeriod * totalPeriods;
    const capitalGainLoss = faceValue - marketPrice;
    return totalCoupons + capitalGainLoss;
  }

  private generateCashFlows(
    strategy: FrequencyStrategy,
    faceValue: number,
    couponRate: number,
    yearsToMaturity: number,
    couponPerPeriod: number,
  ): CashFlow[] {
    const periodsPerYear = strategy.getPeriodsPerYear();
    const totalPeriods = yearsToMaturity * periodsPerYear;
    const monthsPerPeriod = strategy.getMonthsPerPeriod();

    const startDate = new Date();
    const cashFlows: CashFlow[] = [];

    for (let t = 1; t <= totalPeriods; t++) {
      const paymentDate = new Date(startDate);
      paymentDate.setMonth(paymentDate.getMonth() + t * monthsPerPeriod);

      const dateStr = paymentDate.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });

      const cumulative = couponPerPeriod * t;
      const isLastPeriod = t === totalPeriods;

      const flow: CashFlow = {
        period: t,
        date: dateStr,
        coupon: Math.round(couponPerPeriod * 100) / 100,
        cumulative: Math.round(cumulative * 100) / 100,
        principal: isLastPeriod ? 0 : faceValue,
      };

      if (isLastPeriod) {
        flow.faceReturned = faceValue;
      }

      cashFlows.push(flow);
    }

    return cashFlows;
  }
}
