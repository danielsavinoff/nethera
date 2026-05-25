import { ApiProperty } from '@nestjs/swagger';
import { GetInvoiceAmountResponseDto } from './GetInvoiceAmountResponseDto.js';

export class GetInvoiceResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  externalId!: string;

  @ApiProperty()
  provider!: string;

  @ApiProperty()
  billingEmail!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty({ type: GetInvoiceAmountResponseDto })
  total!: GetInvoiceAmountResponseDto;

  @ApiProperty({ type: GetInvoiceAmountResponseDto })
  paid!: GetInvoiceAmountResponseDto;

  @ApiProperty({ type: GetInvoiceAmountResponseDto })
  due!: GetInvoiceAmountResponseDto;

  @ApiProperty()
  currency!: string;

  @ApiProperty()
  externalCheckoutUrl!: string;

  @ApiProperty({ required: false })
  expiresAt?: Date;

  @ApiProperty()
  createdAt!: Date;

  constructor(data: GetInvoiceResponseDto) {
    Object.assign(this, data);
  }
}
