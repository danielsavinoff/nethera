import { ApiProperty } from '@nestjs/swagger';

export class GetPaymentResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  amountMinor!: number;

  @ApiProperty()
  currencyCode!: string;

  @ApiProperty({ required: false })
  dueAt?: Date;

  @ApiProperty({ required: false })
  paidAt?: Date;

  @ApiProperty({ required: false })
  failedAt?: Date;

  @ApiProperty({ required: false })
  voidedAt?: Date;

  @ApiProperty()
  provider!: string;

  @ApiProperty()
  externalId!: string;

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

  constructor(data: GetPaymentResponseDto) {
    Object.assign(this, data);
  }
}
