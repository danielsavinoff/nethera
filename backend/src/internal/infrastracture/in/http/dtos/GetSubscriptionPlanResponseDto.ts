import { ApiProperty } from '@nestjs/swagger';
import { GetSubscriptionPlanFeatureResponseDto } from './GetSubscriptionPlanFeatureResponseDto.js';
import { GetSubscriptionPriceResponseDto } from './GetSubscriptionPriceResponseDto.js';
import { GetSubscriptionPlanTranslationResponseDto } from './GetSubscriptionPlanTranslationResponseDto.js';

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
  active!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({
    type: [GetSubscriptionPlanTranslationResponseDto],
  })
  translations!: GetSubscriptionPlanTranslationResponseDto[];

  @ApiProperty({
    type: [GetSubscriptionPlanFeatureResponseDto],
  })
  features!: GetSubscriptionPlanFeatureResponseDto[];

  @ApiProperty({
    type: [GetSubscriptionPriceResponseDto],
  })
  prices!: GetSubscriptionPriceResponseDto[];

  constructor(data: GetSubscriptionPlanResponseDto) {
    Object.assign(this, data);
  }
}
