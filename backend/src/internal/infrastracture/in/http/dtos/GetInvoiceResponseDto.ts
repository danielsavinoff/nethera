import { ApiProperty } from '@nestjs/swagger';

export class GetInvoiceResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  externalId!: string;

  @ApiProperty()
  provider!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  amountDueMinor!: number;

  @ApiProperty()
  currency!: string;

  @ApiProperty()
  externalCheckoutUrl!: string;

  @ApiProperty({ required: false })
  expiresAt?: Date;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  constructor(data: GetInvoiceResponseDto) {
    Object.assign(this, data);
  }
}
