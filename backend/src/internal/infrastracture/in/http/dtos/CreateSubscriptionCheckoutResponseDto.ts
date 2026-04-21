import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionCheckoutResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  planId!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  provider!: string;

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
