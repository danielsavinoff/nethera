import { ApiProperty } from '@nestjs/swagger';
import { GetPlanFeatureResponseDto } from './GetPlanFeatureResponseDto.js';
import { GetPlanTranslationResponseDto } from './GetPlanTranslationResponseDto.js';

export class GetPlanResponseDto {
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

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({
    type: [GetPlanTranslationResponseDto],
  })
  translations!: GetPlanTranslationResponseDto[];

  @ApiProperty({
    type: [GetPlanFeatureResponseDto],
  })
  features!: GetPlanFeatureResponseDto[];

  constructor(data: GetPlanResponseDto) {
    Object.assign(this, data);
  }
}
