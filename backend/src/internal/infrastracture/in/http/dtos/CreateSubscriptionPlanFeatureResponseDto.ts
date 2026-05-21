import { ApiProperty } from '@nestjs/swagger';
import { CreateSubscriptionPlanFeatureTranslationResponseDto } from './CreateSubscriptionPlanFeatureTranslationResponseDto.js';

export class CreateSubscriptionPlanFeatureResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty({ required: false })
  value?: string;

  @ApiProperty()
  sortOrder!: number;

  @ApiProperty()
  active!: boolean;

  @ApiProperty({
    type: [CreateSubscriptionPlanFeatureTranslationResponseDto],
  })
  translations!: CreateSubscriptionPlanFeatureTranslationResponseDto[];

  constructor(data: CreateSubscriptionPlanFeatureResponseDto) {
    Object.assign(this, data);
  }
}
