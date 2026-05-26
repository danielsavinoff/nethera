import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { SupportedCurrency } from '../../../../domain/money/SupportedCurrency.js';

export class GetSupportedCurrenciesResponseDto {
  @Expose()
  @ApiProperty({
    enum: SupportedCurrency,
    isArray: true,
  })
  currencies!: SupportedCurrency[];

  constructor(data: GetSupportedCurrenciesResponseDto) {
    Object.assign(this, data);
  }
}
