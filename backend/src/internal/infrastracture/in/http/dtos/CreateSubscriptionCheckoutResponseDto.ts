import { ApiProperty } from '@nestjs/swagger';
import { PaymentProvider } from '../../../../domain/subscription/PaymentProvider.js';

export class CreateSubscriptionCheckoutResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  planId!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty({ enum: PaymentProvider })
  provider!: PaymentProvider;

  @ApiProperty({ required: false })
  providerSessionId?: string;

  @ApiProperty({ required: false })
  checkoutUrl?: string;

  @ApiProperty({ required: false })
  expiresAt?: Date;

  @ApiProperty({ required: false })
  completedAt?: Date;

  @ApiProperty({ required: false })
  failedAt?: Date;

  constructor(data: CreateSubscriptionCheckoutResponseDto) {
    Object.assign(this, data);
  }
}
