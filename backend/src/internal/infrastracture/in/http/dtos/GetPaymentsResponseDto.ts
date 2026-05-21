import { ApiProperty } from '@nestjs/swagger';
import { GetPaymentResponseDto } from './GetPaymentResponseDto.js';

export class GetPaymentsResponseDto {
  @ApiProperty({
    type: [GetPaymentResponseDto],
  })
  payments!: GetPaymentResponseDto[];

  constructor(data: GetPaymentsResponseDto) {
    Object.assign(this, data);
  }
}
