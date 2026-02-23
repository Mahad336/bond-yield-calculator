import {
  IsNumber,
  IsInt,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { BondFrequencyEnum } from '../types/bond.types';

export class BondInputDto {
  @IsNumber()
  @Min(1)
  faceValue: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  couponRate: number;

  @IsNumber()
  @Min(1)
  marketPrice: number;

  @IsInt()
  @Min(1)
  yearsToMaturity: number;

  @IsEnum(BondFrequencyEnum)
  frequency: 'annual' | 'semi-annual';
}
