import { ApiProperty } from '@nestjs/swagger';

export class GetInvoiceLineAmountResponseDto {
  @ApiProperty()
  minor!: number;

  @ApiProperty()
  currencyCode!: string;

  @ApiProperty()
  formatted!: string;

  constructor(data: GetInvoiceLineAmountResponseDto) {
    Object.assign(this, data);
  }
}
