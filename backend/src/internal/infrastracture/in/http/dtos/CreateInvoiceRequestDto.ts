import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

import { BillingProvider } from '../../../../domain/subscription/BillingProvider.js';

export class CreateInvoiceRequestDto {
  @ApiProperty()
  @IsString()
  subscriptionPlanId!: string;

  @ApiProperty({ enum: BillingProvider })
  @IsEnum(BillingProvider)
  provider!: BillingProvider;
}
