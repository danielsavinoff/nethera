import { ApiProperty } from '@nestjs/swagger';
import { GetInvoiceLineAmountResponseDto } from './GetInvoiceLineAmountResponseDto.js';

export class GetInvoiceLineResponseDto {
  @ApiProperty()
  title!: string;

  @ApiProperty({ type: GetInvoiceLineAmountResponseDto })
  amount!: GetInvoiceLineAmountResponseDto;

  constructor(data: GetInvoiceLineResponseDto) {
    Object.assign(this, data);
  }
}
