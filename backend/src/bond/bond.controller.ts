import { Body, Controller, Post } from '@nestjs/common';
import { BondService } from './bond.service';
import { BondInputDto } from './dto/bond-input.dto';

@Controller('bond')
export class BondController {
  constructor(private readonly bondService: BondService) {}

  @Post('calculate')
  calculate(@Body() dto: BondInputDto) {
    return this.bondService.calculate(dto);
  }
}
