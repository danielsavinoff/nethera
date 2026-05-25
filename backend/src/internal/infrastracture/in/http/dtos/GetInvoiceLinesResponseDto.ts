import { ApiProperty } from '@nestjs/swagger';
import { GetInvoiceLineResponseDto } from './GetInvoiceLineResponseDto.js';

export class GetInvoiceLinesResponseDto {
  @ApiProperty({
    type: [GetInvoiceLineResponseDto],
  })
  lines!: GetInvoiceLineResponseDto[];

  constructor(data: GetInvoiceLinesResponseDto) {
    Object.assign(this, data);
  }
}
