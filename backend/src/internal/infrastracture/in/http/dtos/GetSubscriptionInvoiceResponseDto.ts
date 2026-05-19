import { ApiProperty } from '@nestjs/swagger';

export class GetSubscriptionInvoiceResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  subscriptionId!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  amountDue!: string;

  @ApiProperty()
  amountPaid!: string;

  @ApiProperty()
  currency!: string;

  @ApiProperty({ required: false })
  periodStartAt?: Date;

  @ApiProperty({ required: false })
  periodEndAt?: Date;

  @ApiProperty()
  issuedAt!: Date;

  @ApiProperty({ required: false })
  dueAt?: Date;

  @ApiProperty({ required: false })
  paidAt?: Date;

  @ApiProperty({ required: false })
  failedAt?: Date;

  @ApiProperty({ required: false })
  voidedAt?: Date;

  @ApiProperty({ required: false })
  provider?: string;

  @ApiProperty({ required: false })
  providerInvoiceId?: string;

  @ApiProperty({ required: false })
  providerPaymentIntentId?: string;

  @ApiProperty({ required: false })
  checkoutUrl?: string;

  @ApiProperty({ required: false })
  failureCode?: string;

  @ApiProperty({ required: false })
  failureMessage?: string;

  @ApiProperty({ required: false })
  metadata?: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  constructor(data: GetSubscriptionInvoiceResponseDto) {
    Object.assign(this, data);
  }
}
