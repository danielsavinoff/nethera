import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BillingProvider } from '../../../../domain/subscription/BillingProvider.js';

export class GetBillingProvidersResponseDto {
  @Expose()
  @ApiProperty({
    enum: BillingProvider,
    isArray: true,
  })
  providers!: BillingProvider[];

  constructor(data: GetBillingProvidersResponseDto) {
    Object.assign(this, data);
  }
}
