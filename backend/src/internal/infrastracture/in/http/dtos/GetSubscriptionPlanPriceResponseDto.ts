import { ApiProperty } from '@nestjs/swagger';

export class GetSubscriptionPlanPriceResponseDto {
  @ApiProperty()
  currencyCode!: string;

  @ApiProperty()
  amountMinor!: number;

  @ApiProperty()
  formatted!: string;

  constructor(data: GetSubscriptionPlanPriceResponseDto) {
    Object.assign(this, data);
  }
}
