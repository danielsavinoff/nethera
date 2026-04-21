import { ApiProperty } from '@nestjs/swagger';
import { CreatePlanFeatureResponseDto } from './CreatePlanFeatureResponseDto.js';
import { CreatePlanTranslationResponseDto } from './CreatePlanTranslationResponseDto.js';

export class CreatePlanResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  priceAmount!: string;

  @ApiProperty()
  priceCurrency!: string;

  @ApiProperty()
  billingInterval!: string;

  @ApiProperty()
  billingIntervalCount!: number;

  @ApiProperty({ required: false })
  trialDays?: number;

  @ApiProperty()
  active!: boolean;

  @ApiProperty({
    type: [CreatePlanTranslationResponseDto],
  })
  translations!: CreatePlanTranslationResponseDto[];

  @ApiProperty({
    type: [CreatePlanFeatureResponseDto],
  })
  features!: CreatePlanFeatureResponseDto[];

  constructor(data: CreatePlanResponseDto) {
    Object.assign(this, data);
  }
}
