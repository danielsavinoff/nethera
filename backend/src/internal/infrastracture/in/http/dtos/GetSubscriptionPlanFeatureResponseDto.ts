import { ApiProperty } from '@nestjs/swagger';
import { GetSubscriptionPlanFeatureTranslationResponseDto } from './GetSubscriptionPlanFeatureTranslationResponseDto.js';

export class GetSubscriptionPlanFeatureResponseDto {
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
    type: [GetSubscriptionPlanFeatureTranslationResponseDto],
  })
  translations!: GetSubscriptionPlanFeatureTranslationResponseDto[];

  constructor(data: GetSubscriptionPlanFeatureResponseDto) {
    Object.assign(this, data);
  }
}
