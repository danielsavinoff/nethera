import { ApiProperty } from '@nestjs/swagger';

export class GetSubscriptionPriceResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  subscriptionPlanId!: string;

  @ApiProperty()
  amountMinor!: number;

  @ApiProperty()
  currency!: string;

  @ApiProperty()
  locale!: string;

  @ApiProperty()
  active!: boolean;

  @ApiProperty()
  createdAt!: Date;

  constructor(data: GetSubscriptionPriceResponseDto) {
    Object.assign(this, data);
  }
}
