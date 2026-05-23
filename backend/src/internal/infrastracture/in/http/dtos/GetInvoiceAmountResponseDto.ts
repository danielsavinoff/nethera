import { ApiProperty } from '@nestjs/swagger';

export class GetInvoiceAmountResponseDto {
  @ApiProperty()
  amountMinor!: number;

  @ApiProperty()
  formatted!: string;

  constructor(data: GetInvoiceAmountResponseDto) {
    Object.assign(this, data);
  }
}
