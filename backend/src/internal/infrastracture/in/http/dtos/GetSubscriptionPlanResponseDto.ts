import { ApiProperty } from '@nestjs/swagger';
import { GetSubscriptionPlanFeatureResponseDto } from './GetSubscriptionPlanFeatureResponseDto.js';
import { GetSubscriptionPlanPriceResponseDto } from './GetSubscriptionPlanPriceResponseDto.js';

export class GetSubscriptionPlanResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  billingInterval!: string;

  @ApiProperty()
  billingIntervalCount!: number;

  @ApiProperty({ required: false })
  trialDays?: number;

  @ApiProperty()
  isPublic!: boolean;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({
    type: [GetSubscriptionPlanFeatureResponseDto],
  })
  features!: GetSubscriptionPlanFeatureResponseDto[];

  @ApiProperty({
    type: GetSubscriptionPlanPriceResponseDto,
    required: false,
  })
  price?: GetSubscriptionPlanPriceResponseDto;

  constructor(data: GetSubscriptionPlanResponseDto) {
    Object.assign(this, data);
  }
}
