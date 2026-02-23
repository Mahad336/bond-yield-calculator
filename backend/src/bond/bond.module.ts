import { Module } from '@nestjs/common';
import { BondController } from './bond.controller';
import { BondService } from './bond.service';
import { FrequencyStrategyFactory } from './strategies/frequency-strategy.factory';

@Module({
  controllers: [BondController],
  providers: [BondService, FrequencyStrategyFactory],
})
export class BondModule {}
