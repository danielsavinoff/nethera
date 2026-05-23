import { ApiProperty } from '@nestjs/swagger';
import { CreateSubscriptionPlanFeatureResponseDto } from './CreateSubscriptionPlanFeatureResponseDto.js';
import { GetSubscriptionPriceResponseDto } from './GetSubscriptionPriceResponseDto.js';
import { CreateSubscriptionPlanTranslationResponseDto } from './CreateSubscriptionPlanTranslationResponseDto.js';

export class CreateSubscriptionPlanResponseDto {
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

  @ApiProperty({
    type: [CreateSubscriptionPlanTranslationResponseDto],
  })
  translations!: CreateSubscriptionPlanTranslationResponseDto[];

  @ApiProperty({
    type: [CreateSubscriptionPlanFeatureResponseDto],
  })
  features!: CreateSubscriptionPlanFeatureResponseDto[];

  @ApiProperty({
    type: [GetSubscriptionPriceResponseDto],
  })
  prices!: GetSubscriptionPriceResponseDto[];

  constructor(data: CreateSubscriptionPlanResponseDto) {
    Object.assign(this, data);
  }
}
