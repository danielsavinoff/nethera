import { ApiProperty } from '@nestjs/swagger';
import { GetSubscriptionInvoiceResponseDto } from './GetSubscriptionInvoiceResponseDto.js';

export class GetSubscriptionInvoicesResponseDto {
  @ApiProperty({
    type: [GetSubscriptionInvoiceResponseDto],
  })
  invoices!: GetSubscriptionInvoiceResponseDto[];

  constructor(data: GetSubscriptionInvoicesResponseDto) {
    Object.assign(this, data);
  }
}
