import { ApiProperty } from '@nestjs/swagger';

export class GetInvoiceLineAmountResponseDto {
  @ApiProperty()
  minor!: number;

  @ApiProperty()
  currency!: string;

  @ApiProperty()
  formatted!: string;

  constructor(data: GetInvoiceLineAmountResponseDto) {
    Object.assign(this, data);
  }
}
