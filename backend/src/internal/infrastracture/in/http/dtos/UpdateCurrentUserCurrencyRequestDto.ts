import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { SupportedCurrency } from '../../../../domain/money/SupportedCurrency.js';

export class UpdateCurrentUserCurrencyRequestDto {
  @ApiProperty({ enum: SupportedCurrency })
  @IsEnum(SupportedCurrency)
  preferredCurrencyCode!: SupportedCurrency;
}
