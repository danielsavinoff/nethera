import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

import { PaymentProvider } from '../../../../domain/subscription/PaymentProvider.js';

export class CreateSubscriptionCheckoutRequestDto {
  @ApiProperty()
  @IsString()
  planId!: string;

  @ApiProperty({ enum: PaymentProvider })
  @IsEnum(PaymentProvider)
  provider!: PaymentProvider;
}
