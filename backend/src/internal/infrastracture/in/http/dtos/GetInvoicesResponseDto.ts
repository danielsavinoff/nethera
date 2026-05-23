import { ApiProperty } from '@nestjs/swagger';
import { GetInvoiceResponseDto } from './GetInvoiceResponseDto.js';

export class GetInvoicesResponseDto {
  @ApiProperty({
    type: [GetInvoiceResponseDto],
  })
  invoices!: GetInvoiceResponseDto[];

  constructor(data: GetInvoicesResponseDto) {
    Object.assign(this, data);
  }
}
